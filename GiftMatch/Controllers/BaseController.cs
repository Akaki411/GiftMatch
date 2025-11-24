using GiftMatch.Entity;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected int GetCurrentUserId()
        {
            if (HttpContext.Items.TryGetValue("UserId", out var userId))
            {
                return (int)userId!;
            }
            
            string? userIdClaim = User.FindFirst("userId")?.Value;
            
            if (userIdClaim != null && int.TryParse(userIdClaim, out int id))
            {
                return id;
            }
            
            throw new UnauthorizedAccessException("Пользователь не авторизован");
        }

        protected User? GetCurrentUser()
        {
            if (HttpContext.Items.TryGetValue("User", out var user))
            {
                return user as User;
            }

            return null;
        }
        
        protected (int page, int limit) GetPaginationParams(int defaultPage = 1, int defaultLimit = 10)
        {
            int page = HttpContext.Items.TryGetValue("Page", out var p) ? (int)p! : defaultPage;
            int limit = HttpContext.Items.TryGetValue("Limit", out var l) ? (int)l! : defaultLimit;

            return (page, limit);
        }

        protected bool IsAdmin()
        {
            return User.IsInRole("ADMIN");
        }

        protected bool IsModerOrAdmin()
        {
            return User.IsInRole("MODER") || User.IsInRole("ADMIN");
        }
    }
}