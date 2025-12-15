using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    public class ProductController : BaseController
    {
        private readonly IProductService _productService;
        private readonly IImageService _imageService;

        public ProductController(IProductService productService, IImageService imageService)
        {
            _productService = productService;
            _imageService = imageService;
        }

        [HttpGet(ApiRoutes.Product.GetAll)]
        public async Task<ActionResult<PagedResult<ProductDto>>> GetAllProducts([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (int validatedPage, int validatedLimit) = GetPaginationParams(page, limit);
            PagedResult<ProductDto> result = await _productService.GetAllProductsAsync(validatedPage, validatedLimit);
            return Ok(result);
        }

        [HttpGet(ApiRoutes.Product.GetByCategory)]
        public async Task<ActionResult<PagedResult<ProductDto>>> GetProductsByCategory(int categoryId, [FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (int validatedPage, int validatedLimit) = GetPaginationParams(page, limit);
            PagedResult<ProductDto> result = await _productService.GetProductsByCategoryAsync(categoryId, validatedPage, validatedLimit);
            return Ok(result);
        }

        [HttpGet(ApiRoutes.Product.GetById)]
        public async Task<ActionResult<ProductDto>> GetProduct(int productId)
        {
            ProductDto product = await _productService.GetProductByIdAsync(productId);
            return Ok(product);
        }

        [HttpPost(ApiRoutes.Product.Create)]
        [Authorize(Policy = "ModerOrAdmin")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromForm] CreateProductRequest request, [FromForm] List<IFormFile>? images)
        {
            List<int> imageIds = new List<int>();
            if (images != null && images.Any())
            {
                imageIds = await _imageService.SaveImagesAsync(images, ImageType.Product);
            }

            ProductDto product = await _productService.CreateProductAsync(request, imageIds);
            return CreatedAtAction(nameof(GetProduct), new { productId = product.ProductId }, product);
        }

        [HttpPut(ApiRoutes.Product.Update)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(int productId, [FromBody] UpdateProductRequest request)
        {
            ProductDto product = await _productService.UpdateProductAsync(productId, request);
            return Ok(product);
        }

        [HttpDelete(ApiRoutes.Product.Delete)]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            await _productService.DeleteProductAsync(productId);
            return NoContent();
        }
    }
}