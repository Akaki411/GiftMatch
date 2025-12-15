using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

namespace GiftMatch.api.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllCategoriesAsync(string? searchName);
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request, int? imageId);
        Task DeleteCategoryAsync(int categoryId);
    }

    public class CategoryService : ICategoryService
    {
        private readonly GiftMatchDbContext _context;
        private readonly IImageService _imageService;

        public CategoryService(GiftMatchDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        public async Task<List<CategoryDto>> GetAllCategoriesAsync(string? searchName)
        {
            IQueryable<Category> query = _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchName))
            {
                searchName = searchName.ToLower();
                query = query.Where(c => c.Name.ToLower().Contains(searchName));
            }

            List<Category> categories = await query.OrderBy(c => c.Name).ToListAsync();
            
            List<CategoryDto> categoryDtos = new List<CategoryDto>();
            foreach (var category in categories)
            {
                categoryDtos.Add(await MapToCategoryDtoAsync(category));
            }

            return categoryDtos;
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request, int? imageId)
        {
            if (request.ParentCategoryId.HasValue)
            {
                bool parentExists = await _context.Categories.AnyAsync(c => c.CategoryId == request.ParentCategoryId.Value);
                if (!parentExists)
                {
                    throw new KeyNotFoundException("Родительская категория не найдена");
                }
            }

            Category category = new Category
            {
                Name = request.Name,
                Description = request.Description,
                ParentCategoryId = request.ParentCategoryId,
                ImageId = imageId
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            Category? created = await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.CategoryId == category.CategoryId);

            return await MapToCategoryDtoAsync(created!);
        }

        public async Task DeleteCategoryAsync(int categoryId)
        {
            Category? category = await _context.Categories
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            if (category == null)
            {
                throw new KeyNotFoundException("Категория не найдена");
            }

            if (category.SubCategories.Any())
            {
                throw new InvalidOperationException("Невозможно удалить категорию с подкатегориями");
            }

            if (category.ImageId.HasValue)
            {
                try
                {
                    await _imageService.DeleteImageAsync(category.ImageId.Value);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete category image: {ex.Message}");
                }
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

        private async Task<CategoryDto> MapToCategoryDtoAsync(Category category)
        {
            string? imageUrl = null;
            if (category.ImageId.HasValue)
            {
                imageUrl = await _imageService.GetImageUrlAsync(category.ImageId.Value);
            }

            List<CategoryDto> subCategoriesDtos = new List<CategoryDto>();
            foreach (var subCategory in category.SubCategories)
            {
                string? subImageUrl = null;
                if (subCategory.ImageId.HasValue)
                {
                    subImageUrl = await _imageService.GetImageUrlAsync(subCategory.ImageId.Value);
                }

                subCategoriesDtos.Add(new CategoryDto
                {
                    CategoryId = subCategory.CategoryId,
                    Name = subCategory.Name,
                    Description = subCategory.Description,
                    ParentCategoryId = subCategory.ParentCategoryId,
                    ImageUrl = subImageUrl
                });
            }

            return new CategoryDto
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId,
                ParentCategoryName = category.ParentCategory?.Name,
                ImageUrl = imageUrl,
                SubCategories = subCategoriesDtos
            };
        }
    }
}