using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

namespace GiftMatch.api.Services
{
    public interface IWishlistService
    {
        Task<WishlistItemDto> AddToWishlistAsync(int userId, AddToWishlistRequest request);
        Task<List<WishlistDto>> GetUserWishlistsAsync(int userId);
        Task<WishlistDto> GetWishlistAsync(int wishlistId);
        Task RemoveFromWishlistAsync(int userId, int wishlistItemId);
    }

    public class WishlistService : IWishlistService
    {
        private readonly GiftMatchDbContext _context;

        public WishlistService(GiftMatchDbContext context)
        {
            _context = context;
        }

        public async Task<WishlistItemDto> AddToWishlistAsync(int userId, AddToWishlistRequest request)
        {
            Wishlist? wishlist;
            if (request.WishlistId.HasValue)
            {
                wishlist = await _context.Wishlists.FirstOrDefaultAsync(w => w.WishlistId == request.WishlistId.Value && w.UserId == userId);
                
                if (wishlist == null)
                {
                    throw new KeyNotFoundException("Wishlist не найден");
                }
            }
            else
            {
                wishlist = await _context.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.Name == "Мой список желаний");
                
                if (wishlist == null)
                {
                    wishlist = new Wishlist
                    {
                        UserId = userId,
                        Name = "Мой список желаний",
                        IsPublic = false
                    };
                    _context.Wishlists.Add(wishlist);
                    await _context.SaveChangesAsync();
                }
            }

            bool productExists = await _context.Products.AnyAsync(p => p.ProductId == request.ProductId);
            if (!productExists)
            {
                throw new KeyNotFoundException("Товар не найден");
            }

            WishlistItem? existingItem = await _context.WishlistItems.FirstOrDefaultAsync(wi => wi.WishlistId == wishlist.WishlistId && wi.ProductId == request.ProductId);
            
            if (existingItem != null)
            {
                throw new InvalidOperationException("Товар уже в списке желаний");
            }

            WishlistItem wishlistItem = new WishlistItem
            {
                WishlistId = wishlist.WishlistId,
                ProductId = request.ProductId,
                Priority = request.Priority,
                Notes = request.Notes
            };

            _context.WishlistItems.Add(wishlistItem);
            await _context.SaveChangesAsync();

            WishlistItem? item = await _context.WishlistItems
                .Include(wi => wi.Product)
                .ThenInclude(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(wi => wi.Product)
                .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(wi => wi.WishlistItemId == wishlistItem.WishlistItemId);

            return MapToWishlistItemDto(item!);
        }

        public async Task<List<WishlistDto>> GetUserWishlistsAsync(int userId)
        {
            List<Wishlist> wishlists = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
                .ThenInclude(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
                .ThenInclude(p => p.ProductImages)
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();

            return wishlists.Select(MapToWishlistDto).ToList();
        }

        public async Task<WishlistDto> GetWishlistAsync(int wishlistId)
        {
            Wishlist? wishlist = await _context.Wishlists
                .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
                .ThenInclude(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
                .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(w => w.WishlistId == wishlistId);
            
            if (wishlist == null)
            {
                throw new KeyNotFoundException("Wishlist не найден");
            }
            return MapToWishlistDto(wishlist);
        }

        public async Task RemoveFromWishlistAsync(int userId, int wishlistItemId)
        {
            WishlistItem? wishlistItem = await _context.WishlistItems
                .Include(wi => wi.Wishlist)
                .FirstOrDefaultAsync(wi => wi.WishlistItemId == wishlistItemId);

            if (wishlistItem == null)
            {
                throw new KeyNotFoundException("Элемент wishlist не найден");
            }

            if (wishlistItem.Wishlist.UserId != userId)
            {
                throw new UnauthorizedAccessException("Нет доступа к этому wishlist");
            }

            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();
        }

        private static WishlistDto MapToWishlistDto(Wishlist wishlist)
        {
            return new WishlistDto
            {
                WishlistId = wishlist.WishlistId,
                Name = wishlist.Name,
                Description = wishlist.Description,
                IsPublic = wishlist.IsPublic,
                Items = wishlist.WishlistItems.Select(MapToWishlistItemDto).ToList()
            };
        }

        private static WishlistItemDto MapToWishlistItemDto(WishlistItem item)
        {
            return new WishlistItemDto
            {
                WishlistItemId = item.WishlistItemId,
                Product = new ProductDto
                {
                    ProductId = item.Product.ProductId,
                    Name = item.Product.Name,
                    Description = item.Product.Description,
                    Price = item.Product.Price,
                    StockQuantity = item.Product.StockQuantity,
                    IsActive = item.Product.IsActive,
                    Categories = item.Product.ProductCategories.Select(pc => pc.Category.Name).ToList(),
                    ImageIds = item.Product.ProductImages.OrderBy(pi => pi.DisplayOrder).Select(pi => pi.ImageId).ToList()
                },
                Priority = item.Priority,
                Notes = item.Notes,
                AddedAt = item.AddedAt
            };
        }
    }
}