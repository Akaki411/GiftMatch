using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace GiftMatch.api.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, GiftMatchDbContext dbContext)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                string? userIdClaim = context.User.FindFirst("userId")?.Value;
                
                if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
                {
                    User? user = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);

                    if (user != null)
                    {
                        context.Items["User"] = user;
                        context.Items["UserId"] = userId;
                    }
                }
            }

            await _next(context);
        }
    }
}