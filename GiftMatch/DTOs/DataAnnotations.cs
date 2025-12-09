using System.ComponentModel.DataAnnotations;

namespace GiftMatch.api.DTOs
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = null!;

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
    
    public class CheckEmailRequest
    {
        public bool isRegister { get; set; }  = false;
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public UserDto User { get; set; } = null!;
    }

    public class ValidateTokenResponse
    {
        public bool IsValid { get; set; }
        public UserDto? User { get; set; }
        public string? Message { get; set; }
    }
    
    public class CheckEmailResponse
    {
        public bool isRegister { get; set; }
    }

    public class UserDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Role { get; set; } = null!;
        public int? AvatarImageId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateUserRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? AvatarImageId { get; set; }
    }

    public class ProductDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; }
        public List<string> Categories { get; set; } = new();
        public List<int> ImageIds { get; set; } = new();
    }

    public class CreateProductRequest
    {
        [Required]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        public List<int>? CategoryIds { get; set; }
        public List<int>? ImageIds { get; set; }
    }

    public class UpdateProductRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        [Range(0, double.MaxValue)]
        public decimal? Price { get; set; }
        [Range(0, int.MaxValue)]
        public int? StockQuantity { get; set; }
        public bool? IsActive { get; set; }
        public List<int>? CategoryIds { get; set; }
        public List<int>? ImageIds { get; set; }
    }

    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int? ParentCategoryId { get; set; }
        public string? ParentCategoryName { get; set; }
        public List<CategoryDto> SubCategories { get; set; } = new();
    }

    public class CreateCategoryRequest
    {
        [Required]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int? ParentCategoryId { get; set; }
    }

    public class WishlistDto
    {
        public int WishlistId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsPublic { get; set; }
        public List<WishlistItemDto> Items { get; set; } = new();
    }

    public class WishlistItemDto
    {
        public int WishlistItemId { get; set; }
        public ProductDto Product { get; set; } = null!;
        public int Priority { get; set; }
        public string? Notes { get; set; }
        public DateTime AddedAt { get; set; }
    }

    public class AddToWishlistRequest
    {
        [Required]
        public int ProductId { get; set; }
        public int? WishlistId { get; set; }
        public int Priority { get; set; } = 0;
        public string? Notes { get; set; }
    }

    public class CartDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public decimal TotalAmount { get; set; }
    }

    public class CartItemDto
    {
        public int CartItemId { get; set; }
        public ProductDto Product { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime AddedAt { get; set; }
    }

    public class AddToCartRequest
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class CheckoutRequest
    {
        [Required]
        public string DeliveryAddress { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Notes { get; set; }
    }

    public class OrderDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; } = null!;
        public string? TrackingNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public string DeliveryAddress { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int OrderItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        [Required]
        public string Status { get; set; } = null!;
        public string? TrackingNumber { get; set; }
    }

    public class UpdateOrderDetailsRequest
    {
        public string? DeliveryAddress { get; set; }
        public string? Phone { get; set; }
        public string? Notes { get; set; }
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}