using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace GiftMatch.api.Middleware
{
    public class ValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public ValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Query.ContainsKey("page"))
            {
                if (!int.TryParse(context.Request.Query["page"], out int page) || page < 1)
                {
                    await WriteErrorResponse(context, "Параметр 'page' должен быть целым числом >= 1", HttpStatusCode.BadRequest);
                    return;
                }
                context.Items["Page"] = page;
            }

            if (context.Request.Query.ContainsKey("limit"))
            {
                if (!int.TryParse(context.Request.Query["limit"], out int limit) || limit < 1 || limit > 100)
                {
                    await WriteErrorResponse(context, "Параметр 'limit' должен быть от 1 до 100", HttpStatusCode.BadRequest);
                    return;
                }
                context.Items["Limit"] = limit;
            }

            await _next(context);
        }

        private static async Task WriteErrorResponse(HttpContext context, string message, HttpStatusCode statusCode)
        {
            context.Response.StatusCode = (int)statusCode;
            context.Response.ContentType = "application/json";

            var response = new { message };
            string json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}