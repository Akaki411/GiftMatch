using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    [Authorize]
    public class OrderController : BaseController
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet(ApiRoutes.Order.GetAll)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<PagedResult<OrderDto>>> GetAllOrders([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (int validatedPage, int validatedLimit) = GetPaginationParams(page, limit);
            PagedResult<OrderDto> result = await _orderService.GetAllOrdersAsync(validatedPage, validatedLimit);
            return Ok(result);
        }

        [HttpPatch(ApiRoutes.Order.UpdateStatus)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<OrderDto>> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
        {
            OrderDto order = await _orderService.UpdateOrderStatusAsync(orderId, request);
            return Ok(order);
        }

        [HttpPatch(ApiRoutes.Order.UpdateDetails)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<OrderDto>> UpdateOrderDetails(int orderId, [FromBody] UpdateOrderDetailsRequest request)
        {
            OrderDto order = await _orderService.UpdateOrderDetailsAsync(orderId, request);
            return Ok(order);
        }
    }
}