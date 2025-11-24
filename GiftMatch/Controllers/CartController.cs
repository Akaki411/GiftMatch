using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    [Authorize]
    public class CartController : BaseController
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost(ApiRoutes.Cart.AddItem)]
        public async Task<ActionResult<CartItemDto>> AddToCart([FromBody] AddToCartRequest request)
        {
            int userId = GetCurrentUserId();
            CartItemDto item = await _cartService.AddToCartAsync(userId, request);
            return CreatedAtAction(nameof(GetUserCart), new { }, item);
        }

        [HttpDelete(ApiRoutes.Cart.RemoveItem)]
        public async Task<ActionResult> RemoveFromCart(int cartItemId)
        {
            int userId = GetCurrentUserId();
            await _cartService.RemoveFromCartAsync(userId, cartItemId);
            return NoContent();
        }

        [HttpGet(ApiRoutes.Cart.Get)]
        public async Task<ActionResult<CartDto>> GetUserCart()
        {
            int userId = GetCurrentUserId();
            CartDto cart = await _cartService.GetUserCartAsync(userId);
            return Ok(cart);
        }

        [HttpPost(ApiRoutes.Cart.Checkout)]
        public async Task<ActionResult<OrderDto>> Checkout([FromBody] CheckoutRequest request)
        {
            int userId = GetCurrentUserId();
            OrderDto order = await _cartService.CheckoutAsync(userId, request);
            return Ok(order);
        }
    }
}