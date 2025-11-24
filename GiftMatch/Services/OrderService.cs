using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

namespace GiftMatch.api.Services
{
    public interface IOrderService
    {
        Task<PagedResult<OrderDto>> GetAllOrdersAsync(int page, int limit);
        Task<OrderDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequest request);
        Task<OrderDto> UpdateOrderDetailsAsync(int orderId, UpdateOrderDetailsRequest request);
    }

    public class OrderService : IOrderService
    {
        private readonly GiftMatchDbContext _context;
        private static readonly string[] ValidStatuses = 
        { 
            "В обработке", 
            "Отправляем", 
            "В пути", 
            "В пункте выдачи", 
            "Доставлен", 
            "Отменен" 
        };

        public OrderService(GiftMatchDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<OrderDto>> GetAllOrdersAsync(int page, int limit)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .AsQueryable();

            int totalCount = await query.CountAsync();
            List<Order> orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return new PagedResult<OrderDto>
            {
                Items = orders.Select(MapToOrderDto).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = limit,
                TotalPages = (int)Math.Ceiling(totalCount / (double)limit)
            };
        }

        public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequest request)
        {
            Order? order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                throw new KeyNotFoundException("Заказ не найден");
            }
            if (!ValidStatuses.Contains(request.Status))
            {
                throw new InvalidOperationException($"Недопустимый статус. Допустимые значения: {string.Join(", ", ValidStatuses)}");
            }
            order.Status = request.Status;
            if (!string.IsNullOrWhiteSpace(request.TrackingNumber))
            {
                order.TrackingNumber = request.TrackingNumber;
            }
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            Order? updated = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            return MapToOrderDto(updated!);
        }

        public async Task<OrderDto> UpdateOrderDetailsAsync(int orderId, UpdateOrderDetailsRequest request)
        {
            Order? order = await _context.Orders.FindAsync(orderId);
            
            if (order == null)
            {
                throw new KeyNotFoundException("Заказ не найден");
            }
            
            if (order.Status == "Доставлен" || order.Status == "Отменен")
            {
                throw new InvalidOperationException("Нельзя изменить детали доставленного или отмененного заказа");
            }
            
            if (!string.IsNullOrWhiteSpace(request.DeliveryAddress))
            {
                order.DeliveryAddress = request.DeliveryAddress;
            }
            
            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                order.Phone = request.Phone;
            }
            
            if (request.Notes != null)
            {
                order.Notes = request.Notes;
            }
            
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            Order? updated = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            return MapToOrderDto(updated!);
        }

        private static OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                Status = order.Status,
                TrackingNumber = order.TrackingNumber,
                TotalAmount = order.TotalAmount,
                DeliveryAddress = order.DeliveryAddress,
                Phone = order.Phone,
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    Price = oi.Price,
                    Discount = oi.Discount,
                    Subtotal = (oi.Price - oi.Discount) * oi.Quantity
                }).ToList()
            };
        }
    }
}