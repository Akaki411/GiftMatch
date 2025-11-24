using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet(ApiRoutes.Category.GetAll)]
        public async Task<ActionResult<List<CategoryDto>>> GetAllCategories([FromQuery] string? searchName)
        {
            List<CategoryDto> categories = await _categoryService.GetAllCategoriesAsync(searchName);
            return Ok(categories);
        }

        [HttpPost(ApiRoutes.Category.Create)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            CategoryDto category = await _categoryService.CreateCategoryAsync(request);
            return CreatedAtAction(nameof(GetAllCategories), new { }, category);
        }

        [HttpDelete(ApiRoutes.Category.Delete)]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> DeleteCategory(int categoryId)
        {
            await _categoryService.DeleteCategoryAsync(categoryId);
            return NoContent();
        }
    }
}