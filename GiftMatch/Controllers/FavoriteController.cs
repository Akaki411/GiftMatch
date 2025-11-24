using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    [Authorize]
    public class FavoriteController : BaseController
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpPost(ApiRoutes.Favorite.Add)]
        public async Task<ActionResult> AddToFavorites(int productId)
        {
            int userId = GetCurrentUserId();
            await _favoriteService.AddToFavoritesAsync(userId, productId);
            return Ok(new { message = "Товар добавлен в избранное" });
        }

        [HttpDelete(ApiRoutes.Favorite.Remove)]
        public async Task<ActionResult> RemoveFromFavorites(int productId)
        {
            int userId = GetCurrentUserId();
            await _favoriteService.RemoveFromFavoritesAsync(userId, productId);
            return NoContent();
        }

        [HttpGet(ApiRoutes.Favorite.GetAll)]
        public async Task<ActionResult<List<ProductDto>>> GetUserFavorites()
        {
            int userId = GetCurrentUserId();
            List<ProductDto> favorites = await _favoriteService.GetUserFavoritesAsync(userId);
            return Ok(favorites);
        }
    }
}