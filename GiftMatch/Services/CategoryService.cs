using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

namespace GiftMatch.api.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllCategoriesAsync(string? searchName);
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request);
        Task DeleteCategoryAsync(int categoryId);
    }

    public class CategoryService : ICategoryService
    {
        private readonly GiftMatchDbContext _context;

        public CategoryService(GiftMatchDbContext context)
        {
            _context = context;
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
            return categories.Select(MapToCategoryDto).ToList();
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request)
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
                ParentCategoryId = request.ParentCategoryId
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            Category? created = await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.CategoryId == category.CategoryId);

            return MapToCategoryDto(created!);
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
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

        private static CategoryDto MapToCategoryDto(Category category)
        {
            return new CategoryDto
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId,
                ParentCategoryName = category.ParentCategory?.Name,
                SubCategories = category.SubCategories.Select(sc => new CategoryDto
                {
                    CategoryId = sc.CategoryId,
                    Name = sc.Name,
                    Description = sc.Description,
                    ParentCategoryId = sc.ParentCategoryId
                }).ToList()
            };
        }
    }
}