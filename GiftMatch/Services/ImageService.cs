using GiftMatch.Entity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Image = GiftMatch.Entity.Image;

namespace GiftMatch.api.Services
{
    public interface IImageService
    {
        Task<int> SaveImageAsync(IFormFile file, ImageType imageType);
        Task<List<int>> SaveImagesAsync(List<IFormFile> files, ImageType imageType);
        Task DeleteImageAsync(int imageId);
        Task<string?> GetImageUrlAsync(int imageId);
        Task<List<string>> GetImageUrlsAsync(List<int> imageIds);
    }

    public enum ImageType
    {
        Avatar,
        Product,
        Category
    }

    public class ImageService : IImageService
    {
        private readonly GiftMatchDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ImageService> _logger;

        private const string AvatarsFolder = "uploads/avatars";
        private const string ImagesFolder = "uploads/images";
        private const int MaxImageSize = 5 * 1024 * 1024; // 5MB
        private const int AvatarMaxWidth = 500;
        private const int AvatarMaxHeight = 500;
        private const int ProductImageMaxWidth = 1920;
        private const int ProductImageMaxHeight = 1920;

        public ImageService(GiftMatchDbContext context, IWebHostEnvironment environment, ILogger<ImageService> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        public async Task<int> SaveImageAsync(IFormFile file, ImageType imageType)
        {
            ValidateFile(file);

            string folder = imageType == ImageType.Avatar ? AvatarsFolder : ImagesFolder;
            String fileName = await ProcessAndSaveImageAsync(file, folder, imageType);

            Image image = new Image
            {
                ImageUrl = fileName
            };

            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Image saved: {fileName} (ID: {image.ImageId})");

            return image.ImageId;
        }

        public async Task<List<int>> SaveImagesAsync(List<IFormFile> files, ImageType imageType)
        {
            List<int> imageIds = new List<int>();

            foreach (IFormFile file in files)
            {
                int imageId = await SaveImageAsync(file, imageType);
                imageIds.Add(imageId);
            }

            return imageIds;
        }

        public async Task DeleteImageAsync(int imageId)
        {
            Image? image = await _context.Images.FindAsync(imageId);
            if (image == null)
            {
                throw new KeyNotFoundException("Изображение не найдено");
            }

            String filePath = Path.Combine(_environment.WebRootPath, image.ImageUrl);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                _logger.LogInformation($"Physical file deleted: {filePath}");
            }
            _context.Images.Remove(image);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Image deleted: {image.ImageUrl} (ID: {imageId})");
        }

        public async Task<string?> GetImageUrlAsync(int imageId)
        {
            Image? image = await _context.Images.AsNoTracking().FirstOrDefaultAsync(i => i.ImageId == imageId);

            return image?.ImageUrl;
        }

        public async Task<List<string>> GetImageUrlsAsync(List<int> imageIds)
        {
            if (!imageIds.Any())
            {
                return new List<string>();
            }

            List<string> images = await _context.Images.AsNoTracking().Where(i => imageIds.Contains(i.ImageId)).Select(i => i.ImageUrl).ToListAsync();

            return images;
        }

        private void ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Файл не предоставлен или пуст");
            }

            if (file.Length > MaxImageSize)
            {
                throw new ArgumentException($"Размер файла превышает максимально допустимый ({MaxImageSize / 1024 / 1024} MB)");
            }

            string[] allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                throw new ArgumentException($"Недопустимый формат файла. Разрешены: {string.Join(", ", allowedExtensions)}");
            }
        }

        private async Task<string> ProcessAndSaveImageAsync(IFormFile file, string folder, ImageType imageType)
        {
            String fileName = $"{Guid.NewGuid()}.webp";
            String uploadPath = Path.Combine(_environment.WebRootPath, folder);

            String filePath = Path.Combine(uploadPath, fileName);

            using (var image = await SixLabors.ImageSharp.Image.LoadAsync(file.OpenReadStream()))
            {
                (int maxWidth, int maxHeight) = imageType switch
                {
                    ImageType.Avatar => (AvatarMaxWidth, AvatarMaxHeight),
                    _ => (ProductImageMaxWidth, ProductImageMaxHeight)
                };
                
                if (image.Width > maxWidth || image.Height > maxHeight)
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Mode = ResizeMode.Max,
                        Size = new Size(maxWidth, maxHeight)
                    }));
                }
                
                WebpEncoder encoder = new WebpEncoder
                {
                    Quality = 85,
                    FileFormat = WebpFileFormatType.Lossy
                };

                await image.SaveAsync(filePath, encoder);
            }

            return Path.Combine(folder, fileName).Replace("\\", "/");
        }
    }
}