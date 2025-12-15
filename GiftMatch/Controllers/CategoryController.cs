using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly ICategoryService _categoryService;
        private readonly IImageService _imageService;

        public CategoryController(ICategoryService categoryService, IImageService imageService)
        {
            _categoryService = categoryService;
            _imageService = imageService;
        }

        [HttpGet(ApiRoutes.Category.GetAll)]
        public async Task<ActionResult<List<CategoryDto>>> GetAllCategories([FromQuery] string? searchName)
        {
            List<CategoryDto> categories = await _categoryService.GetAllCategoriesAsync(searchName);
            return Ok(categories);
        }

        [HttpPost(ApiRoutes.Category.Create)]
        [Authorize(Policy = "ModerOrAdmin")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromForm] CreateCategoryRequest request, [FromForm] IFormFile? image)
        {
            int? imageId = null;
            if (image != null)
            {
                imageId = await _imageService.SaveImageAsync(image, ImageType.Category);
            }

            CategoryDto category = await _categoryService.CreateCategoryAsync(request, imageId);
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