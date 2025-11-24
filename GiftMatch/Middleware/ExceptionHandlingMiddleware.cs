using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace GiftMatch.api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "Произошла необработанная ошибка");

            context.Response.ContentType = "application/json";
            
            (HttpStatusCode statusCode, string? message) = exception switch
            {
                KeyNotFoundException => (HttpStatusCode.NotFound, exception.Message),
                UnauthorizedAccessException => (HttpStatusCode.Unauthorized, exception.Message),
                InvalidOperationException => (HttpStatusCode.BadRequest, exception.Message),
                ArgumentException => (HttpStatusCode.BadRequest, exception.Message),
                _ => (HttpStatusCode.InternalServerError, "Произошла внутренняя ошибка сервера")
            };

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                message,
                statusCode = (int)statusCode,
                timestamp = DateTime.UtcNow
            };

            string json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}