using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

namespace GiftMatch.api.Services
{
    public interface ICartService
    {
        Task<CartItemDto> AddToCartAsync(int userId, AddToCartRequest request);
        Task RemoveFromCartAsync(int userId, int cartItemId);
        Task<CartDto> GetUserCartAsync(int userId);
        Task<OrderDto> CheckoutAsync(int userId, CheckoutRequest request);
    }

    public class CartService : ICartService
    {
        private readonly GiftMatchDbContext _context;
        private readonly IImageService _imageService;

        public CartService(GiftMatchDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        public async Task<CartItemDto> AddToCartAsync(int userId, AddToCartRequest request)
        {
            Product? product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                throw new KeyNotFoundException("Товар не найден");
            }

            if (!product.IsActive)
            {
                throw new InvalidOperationException("Товар недоступен");
            }

            if (product.StockQuantity < request.Quantity)
            {
                throw new InvalidOperationException($"Недостаточно товара на складе. Доступно: {product.StockQuantity}");
            }

            CartItem? existingCartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == request.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += request.Quantity;
                existingCartItem.UpdatedAt = DateTime.UtcNow;

                if (product.StockQuantity < existingCartItem.Quantity)
                {
                    throw new InvalidOperationException($"Недостаточно товара на складе. Доступно: {product.StockQuantity}");
                }

                await _context.SaveChangesAsync();

                CartItem? updated = await _context.CartItems
                    .Include(ci => ci.Product)
                    .ThenInclude(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                    .Include(ci => ci.Product)
                    .ThenInclude(p => p.ProductImages)
                    .FirstOrDefaultAsync(ci => ci.CartItemId == existingCartItem.CartItemId);

                return await MapToCartItemDtoAsync(updated!);
            }

            CartItem cartItem = new CartItem
            {
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            CartItem? created = await _context.CartItems
                .Include(ci => ci.Product)
                .ThenInclude(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(ci => ci.Product)
                .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItem.CartItemId);

            return await MapToCartItemDtoAsync(created!);
        }

        public async Task RemoveFromCartAsync(int userId, int cartItemId)
        {
            CartItem? cartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId && ci.UserId == userId);

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Товар не найден в корзине");
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task<CartDto> GetUserCartAsync(int userId)
        {
            List<CartItem> cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .ThenInclude(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(ci => ci.Product)
                .ThenInclude(p => p.ProductImages)
                .OrderByDescending(ci => ci.AddedAt)
                .ToListAsync();

            List<CartItemDto> items =  new List<CartItemDto>();

            foreach (CartItem cartItem in cartItems)
            {
                items.Add(await MapToCartItemDtoAsync(cartItem));
            }
            decimal totalAmount = items.Sum(i => i.Subtotal);

            return new CartDto
            {
                Items = items,
                TotalAmount = totalAmount
            };
        }

        public async Task<OrderDto> CheckoutAsync(int userId, CheckoutRequest request)
        {
            List<CartItem> cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .ToListAsync();

            if (!cartItems.Any())
            {
                throw new InvalidOperationException("Корзина пуста");
            }

            foreach (var cartItem in cartItems)
            {
                if (!cartItem.Product.IsActive)
                {
                    throw new InvalidOperationException($"Товар '{cartItem.Product.Name}' больше не доступен");
                }

                if (cartItem.Product.StockQuantity < cartItem.Quantity)
                {
                    throw new InvalidOperationException($"Недостаточно товара '{cartItem.Product.Name}'. Доступно: {cartItem.Product.StockQuantity}");
                }
            }

            decimal totalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity);
            Order order = new Order
            {
                UserId = userId,
                Status = "В обработке",
                TotalAmount = totalAmount,
                DeliveryAddress = request.DeliveryAddress,
                Phone = request.Phone,
                Notes = request.Notes,
                TrackingNumber = GenerateTrackingNumber()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var cartItem in cartItems)
            {
                OrderItem orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Product.Price,
                    Discount = 0
                };
                _context.OrderItems.Add(orderItem);
                cartItem.Product.StockQuantity -= cartItem.Quantity;
            }

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            Order? createdOrder = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == order.OrderId);

            return MapToOrderDto(createdOrder!);
        }

        private static string GenerateTrackingNumber()
        {
            return $"GM{DateTime.UtcNow:yyyyMMddHHmmss}{Random.Shared.Next(1000, 9999)}";
        }

        private async Task<CartItemDto> MapToCartItemDtoAsync(CartItem cartItem)
        {
            List<int> imageIds = cartItem.Product.ProductImages.OrderBy(pi => pi.DisplayOrder).Select(pi => pi.ImageId).ToList();
            List<string> imageUrls = await _imageService.GetImageUrlsAsync(imageIds);

            return new CartItemDto
            {
                CartItemId = cartItem.CartItemId,
                Product = new ProductDto
                {
                    ProductId = cartItem.Product.ProductId,
                    Name = cartItem.Product.Name,
                    Description = cartItem.Product.Description,
                    Price = cartItem.Product.Price,
                    StockQuantity = cartItem.Product.StockQuantity,
                    IsActive = cartItem.Product.IsActive,
                    Categories = cartItem.Product.ProductCategories.Select(pc => pc.Category.Name).ToList(),
                    ImageUrls = imageUrls
                },
                Quantity = cartItem.Quantity,
                Subtotal = cartItem.Product.Price * cartItem.Quantity,
                AddedAt = cartItem.AddedAt
            };
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