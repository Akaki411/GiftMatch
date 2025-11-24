using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    [Authorize]
    public class WishlistController : BaseController
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpPost(ApiRoutes.Wishlist.AddItem)]
        public async Task<ActionResult<WishlistItemDto>> AddToWishlist([FromBody] AddToWishlistRequest request)
        {
            int userId = GetCurrentUserId();
            WishlistItemDto item = await _wishlistService.AddToWishlistAsync(userId, request);
            return CreatedAtAction(nameof(GetWishlist), new { wishlistId = item.Product.ProductId }, item);
        }

        [HttpGet(ApiRoutes.Wishlist.GetAll)]
        public async Task<ActionResult<List<WishlistDto>>> GetUserWishlists()
        {
            int userId = GetCurrentUserId();
            List<WishlistDto> wishlists = await _wishlistService.GetUserWishlistsAsync(userId);
            return Ok(wishlists);
        }

        [HttpGet(ApiRoutes.Wishlist.GetById)]
        public async Task<ActionResult<WishlistDto>> GetWishlist(int wishlistId)
        {
            WishlistDto wishlist = await _wishlistService.GetWishlistAsync(wishlistId);
            return Ok(wishlist);
        }

        [HttpDelete(ApiRoutes.Wishlist.RemoveItem)]
        public async Task<ActionResult> RemoveFromWishlist(int wishlistItemId)
        {
            int userId = GetCurrentUserId();
            await _wishlistService.RemoveFromWishlistAsync(userId, wishlistItemId);
            return NoContent();
        }
    }
}