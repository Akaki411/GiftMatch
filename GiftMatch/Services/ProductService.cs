using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

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

        public ProductService(GiftMatchDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        public async Task<PagedResult<ProductDto>> GetAllProductsAsync(int page, int limit)
        {
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
            foreach (Product product in items)
            {
                productDtos.Add(await MapToProductDtoAsync(product));
            }

            return new PagedResult<ProductDto>
            {
                Items = productDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = limit,
                TotalPages = (int)Math.Ceiling(totalCount / (double)limit)
            };
        }

        public async Task<PagedResult<ProductDto>> GetProductsByCategoryAsync(int categoryId, int page, int limit)
        {
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
            foreach (Product product in items)
            {
                productDtos.Add(await MapToProductDtoAsync(product));
            }

            return new PagedResult<ProductDto>
            {
                Items = productDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = limit,
                TotalPages = (int)Math.Ceiling(totalCount / (double)limit)
            };
        }

        public async Task<ProductDto> GetProductByIdAsync(int productId)
        {
            Product? product = await _context.Products
                .Include(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                throw new KeyNotFoundException("Товар не найден");
            }

            return await MapToProductDtoAsync(product);
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

                foreach (int categoryId in request.CategoryIds)
                {
                    _context.ProductCategories.Add(new ProductCategory
                    {
                        ProductId = product.ProductId,
                        CategoryId = categoryId
                    });
                }
            }

            await _context.SaveChangesAsync();

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

            foreach (var productImage in product.ProductImages)
            {
                try
                {
                    await _imageService.DeleteImageAsync(productImage.ImageId);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete product image: {ex.Message}");
                }
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
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