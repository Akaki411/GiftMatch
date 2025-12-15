using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

namespace GiftMatch.api.Services
{
    public interface IFavoriteService
    {
        Task AddToFavoritesAsync(int userId, int productId);
        Task RemoveFromFavoritesAsync(int userId, int productId);
        Task<List<ProductDto>> GetUserFavoritesAsync(int userId);
    }

    public class FavoriteService : IFavoriteService
    {
        private readonly GiftMatchDbContext _context;
        private readonly IImageService _imageService;
        
        public FavoriteService(GiftMatchDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        public async Task AddToFavoritesAsync(int userId, int productId)
        {
            bool productExists = await _context.Products.AnyAsync(p => p.ProductId == productId);
            if (!productExists)
            {
                throw new KeyNotFoundException("Товар не найден");
            }
            Favorite? existingFavorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

            if (existingFavorite != null)
            {
                throw new InvalidOperationException("Товар уже в избранном");
            }
            Favorite favorite = new Favorite
            {
                UserId = userId,
                ProductId = productId
            };
            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFromFavoritesAsync(int userId, int productId)
        {
            Favorite? favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

            if (favorite == null)
            {
                throw new KeyNotFoundException("Товар не найден в избранном");
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ProductDto>> GetUserFavoritesAsync(int userId)
        {
            List<Favorite> favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Product)
                .ThenInclude(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(f => f.Product)
                .ThenInclude(p => p.ProductImages)
                .OrderByDescending(f => f.AddedAt)
                .ToListAsync();

            List<ProductDto> productDtos = new List<ProductDto>();

            foreach (Favorite favorite in favorites)
            {
                ProductDto dto = await MapToProductDtoAsync(favorite.Product);
                productDtos.Add(dto);
            }
            
            return productDtos;
        }

        private async Task<ProductDto> MapToProductDtoAsync(Product product)
        {
            List<int> imageIds = product.ProductImages.OrderBy(pi => pi.DisplayOrder).Select(pi => pi.ImageId).ToList();
            List<string> imageUrls = await _imageService.GetImageUrlsAsync(imageIds);

            return new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                IsActive = product.IsActive,
                Categories = product.ProductCategories.Select(pc => pc.Category.Name).ToList(),
                ImageUrls = imageUrls
            };
        }
    }
}