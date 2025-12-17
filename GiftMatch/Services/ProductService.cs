using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiftMatch.api.Services
{
    public interface IProductService
    {
        Task<PagedResult<ProductDto>> GetAllProductsAsync(int page, int limit);
        Task<PagedResult<ProductDto>> GetProductsByCategoryAsync(int categoryId, int page, int limit);
        Task<ProductDto> GetProductByIdAsync(int productId);
        Task<ProductDto> CreateProductAsync(CreateProductRequest request, List<int> imageIds);
        Task<ProductDto> UpdateProductAsync(int productId, UpdateProductRequest request);
        Task DeleteProductAsync(int productId);
    }

    public class ProductService : IProductService
    {
        private readonly GiftMatchDbContext _context;
        private readonly IImageService _imageService;
        private readonly ICacheService _cacheService;
        private readonly ILogger<ProductService> _logger;

        public ProductService(GiftMatchDbContext context, IImageService imageService, ICacheService cacheService, ILogger<ProductService> logger)
        {
            _context = context;
            _imageService = imageService;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<PagedResult<ProductDto>> GetAllProductsAsync(int page, int limit)
        {
            string cacheKey = CacheKeys.Products(page, limit);
            PagedResult<ProductDto>? cached = await _cacheService.GetAsync<PagedResult<ProductDto>>(cacheKey);
            
            if (cached != null)
            {
                _logger.LogDebug($"Returning cached products: page {page}, limit {limit}");
                return cached;
            }

            IQueryable<Product> query = _context.Products
                .Include(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.IsActive);

            int totalCount = await query.CountAsync();
            List<Product> items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            List<ProductDto> productDtos = new List<ProductDto>();
            foreach (var product in items)
            {
                productDtos.Add(await MapToProductDtoAsync(product));
            }

            PagedResult<ProductDto> result = new PagedResult<ProductDto>
            {
                Items = productDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = limit,
                TotalPages = (int)Math.Ceiling(totalCount / (double)limit)
            };

            await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(10));
            _logger.LogDebug($"Cached products: page {page}, limit {limit}");

            return result;
        }

        public async Task<PagedResult<ProductDto>> GetProductsByCategoryAsync(int categoryId, int page, int limit)
        {
            string cacheKey = CacheKeys.ProductsByCategory(categoryId, page, limit);
            PagedResult<ProductDto>? cached = await _cacheService.GetAsync<PagedResult<ProductDto>>(cacheKey);
            
            if (cached != null)
            {
                _logger.LogDebug($"Returning cached products for category {categoryId}");
                return cached;
            }

            IQueryable<Product> query = _context.Products
                .Include(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.IsActive && p.ProductCategories.Any(pc => pc.CategoryId == categoryId));

            int totalCount = await query.CountAsync();
            List<Product> items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            List<ProductDto> productDtos = new List<ProductDto>();
            foreach (var product in items)
            {
                productDtos.Add(await MapToProductDtoAsync(product));
            }

            PagedResult<ProductDto> result = new PagedResult<ProductDto>
            {
                Items = productDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = limit,
                TotalPages = (int)Math.Ceiling(totalCount / (double)limit)
            };

            await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(10));
            _logger.LogDebug($"Cached products for category {categoryId}");

            return result;
        }

        public async Task<ProductDto> GetProductByIdAsync(int productId)
        {
            string cacheKey = CacheKeys.Product(productId);
            ProductDto? cached = await _cacheService.GetAsync<ProductDto>(cacheKey);
            
            if (cached != null)
            {
                _logger.LogDebug($"Returning cached product {productId}");
                return cached;
            }

            Product? product = await _context.Products
                .Include(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                throw new KeyNotFoundException("Товар не найден");
            }

            ProductDto productDto = await MapToProductDtoAsync(product);
            
            await _cacheService.SetAsync(cacheKey, productDto, TimeSpan.FromMinutes(15));
            _logger.LogDebug($"Cached product {productId}");

            return productDto;
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductRequest request, List<int> imageIds)
        {
            Product product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                IsActive = true
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            if (request.CategoryIds != null && request.CategoryIds.Any())
            {
                foreach (int categoryId in request.CategoryIds)
                {
                    _context.ProductCategories.Add(new ProductCategory
                    {
                        ProductId = product.ProductId,
                        CategoryId = categoryId
                    });
                }
            }

            if (imageIds.Any())
            {
                for (int i = 0; i < imageIds.Count; i++)
                {
                    _context.ProductImages.Add(new ProductImage
                    {
                        ProductId = product.ProductId,
                        ImageId = imageIds[i],
                        IsPrimary = i == 0,
                        DisplayOrder = i
                    });
                }
            }

            await _context.SaveChangesAsync();

            await InvalidateProductCacheAsync();
            _logger.LogInformation($"Product created: {product.ProductId}, cache invalidated");

            return await GetProductByIdAsync(product.ProductId);
        }

        public async Task<ProductDto> UpdateProductAsync(int productId, UpdateProductRequest request)
        {
            Product? product = await _context.Products
                .Include(p => p.ProductCategories)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                throw new KeyNotFoundException("Товар не найден");
            }

            if (request.Name != null)
            {
                product.Name = request.Name;
            }

            if (request.Description != null)
            {
                product.Description = request.Description;
            }

            if (request.Price.HasValue)
            {
                product.Price = request.Price.Value;
            }

            if (request.StockQuantity.HasValue)
            {
                product.StockQuantity = request.StockQuantity.Value;
            }

            if (request.IsActive.HasValue)
            {
                product.IsActive = request.IsActive.Value;
            }

            product.UpdatedAt = DateTime.UtcNow;

            if (request.CategoryIds != null)
            {
                List<ProductCategory> existingCategories = product.ProductCategories.ToList();
                _context.ProductCategories.RemoveRange(existingCategories);

                foreach (var categoryId in request.CategoryIds)
                {
                    _context.ProductCategories.Add(new ProductCategory
                    {
                        ProductId = product.ProductId,
                        CategoryId = categoryId
                    });
                }
            }

            await _context.SaveChangesAsync();

            await _cacheService.RemoveAsync(CacheKeys.Product(productId));
            await InvalidateProductCacheAsync();
            _logger.LogInformation($"Product updated: {productId}, cache invalidated");

            return await GetProductByIdAsync(product.ProductId);
        }

        public async Task DeleteProductAsync(int productId)
        {
            Product? product = await _context.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == productId);
            
            if (product == null)
            {
                throw new KeyNotFoundException("Товар не найден");
            }
            List<ProductImage> productImagesCopy = product.ProductImages.ToList();
    
            foreach (ProductImage productImage in productImagesCopy)
            {
                try
                {
                    await _imageService.DeleteImageAsync(productImage.ImageId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Failed to delete product image: {productImage.ImageId}");
                }
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeys.Product(productId));
            await InvalidateProductCacheAsync();
            _logger.LogInformation($"Product deleted: {productId}, cache invalidated");
        }

        private async Task InvalidateProductCacheAsync()
        {
            for (int page = 1; page <= 10; page++)
            {
                await _cacheService.RemoveAsync(CacheKeys.Products(page, 10));
                await _cacheService.RemoveAsync(CacheKeys.Products(page, 20));
            }
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