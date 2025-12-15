using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    [Authorize]
    public class ImageController : BaseController
    {
        private readonly IImageService _imageService;
        private readonly IUserService _userService;

        public ImageController(IImageService imageService, IUserService userService)
        {
            _imageService = imageService;
            _userService = userService;
        }

        [HttpPost(ApiRoutes.Image.UploadAvatar)]
        public async Task<ActionResult<UserDto>> UploadAvatar(IFormFile file)
        {
            int userId = GetCurrentUserId();
            int imageId = await _imageService.SaveImageAsync(file, ImageType.Avatar);
            UserDto user = await _userService.UpdateUserAvatarAsync(userId, imageId);
            
            return Ok(user);
        }
        
        [HttpPost(ApiRoutes.Image.UploadProductImage)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<UploadImageResponse>> UploadProductImage(IFormFile file)
        {
            int imageId = await _imageService.SaveImageAsync(file, ImageType.Product);
            string? imageUrl = await _imageService.GetImageUrlAsync(imageId);
            
            return Ok(new UploadImageResponse
            {
                ImageId = imageId,
                ImageUrl = imageUrl!
            });
        }

        [HttpPost(ApiRoutes.Image.UploadProductImages)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<List<UploadImageResponse>>> UploadProductImages(List<IFormFile> files)
        {
            List<UploadImageResponse> responses = new List<UploadImageResponse>();

            foreach (IFormFile file in files)
            {
                int imageId = await _imageService.SaveImageAsync(file, ImageType.Product);
                string? imageUrl = await _imageService.GetImageUrlAsync(imageId);
                
                responses.Add(new UploadImageResponse
                {
                    ImageId = imageId,
                    ImageUrl = imageUrl!
                });
            }

            return Ok(responses);
        }

        [HttpPost(ApiRoutes.Image.UploadCategoryImage)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult<UploadImageResponse>> UploadCategoryImage(IFormFile file)
        {
            int imageId = await _imageService.SaveImageAsync(file, ImageType.Category);
            string? imageUrl = await _imageService.GetImageUrlAsync(imageId);
            
            return Ok(new UploadImageResponse
            {
                ImageId = imageId,
                ImageUrl = imageUrl!
            });
        }

        [HttpDelete(ApiRoutes.Image.Delete)]
        [Authorize(Policy = "ModerOrAdmin")]
        public async Task<ActionResult> DeleteImage(int imageId)
        {
            await _imageService.DeleteImageAsync(imageId);
            return NoContent();
        }
    }
}