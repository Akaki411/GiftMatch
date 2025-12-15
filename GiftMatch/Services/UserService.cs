using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using Microsoft.EntityFrameworkCore;

namespace GiftMatch.api.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUserByIdAsync(int userId);
        Task<List<UserDto>> GetAllUsersAsync(string? searchName);
        Task<UserDto> UpdateUserAsync(int userId, UpdateUserRequest request);
        Task<UserDto> UpdateUserAvatarAsync(int userId, int imageId);
    }

    public class UserService : IUserService
    {
        private readonly GiftMatchDbContext _context;
        private readonly IImageService _imageService;

        public UserService(GiftMatchDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            User? user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }

            return await MapToUserDtoAsync(user);
        }

        public async Task<List<UserDto>> GetAllUsersAsync(string? searchName)
        {
            IQueryable<User> query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchName))
            {
                searchName = searchName.ToLower();
                query = query.Where(u => 
                    (u.FirstName != null && u.FirstName.ToLower().Contains(searchName)) ||
                    (u.LastName != null && u.LastName.ToLower().Contains(searchName)) ||
                    u.Email.ToLower().Contains(searchName)
                );
            }

            List<User> users = await query.OrderBy(u => u.CreatedAt).ToListAsync();
            List<UserDto> userDtos = new List<UserDto>();

            foreach (User user in users)
            {
                userDtos.Add(await MapToUserDtoAsync(user));
            }

            return userDtos;
        }

        public async Task<UserDto> UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            User? user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Неверный пароль");
            }

            if (request.FirstName != null)
            {
                user.FirstName = request.FirstName;
            }

            if (request.LastName != null)
            {
                user.LastName = request.LastName;
            }

            if (request.Email != null)
            {
                user.Email = request.Email;
            }

            if (!string.IsNullOrEmpty(request.NewPassword))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return await MapToUserDtoAsync(user);
        }

        public async Task<UserDto> UpdateUserAvatarAsync(int userId, int imageId)
        {
            User? user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }
            
            if (user.AvatarImageId.HasValue)
            {
                try
                {
                    await _imageService.DeleteImageAsync(user.AvatarImageId.Value);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete old avatar: {ex.Message}");
                }
            }

            user.AvatarImageId = imageId;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await MapToUserDtoAsync(user);
        }
        
        private async Task<UserDto> MapToUserDtoAsync(User user)
        {
            string? avatarUrl = null;
            if (user.AvatarImageId.HasValue)
            {
                avatarUrl = await _imageService.GetImageUrlAsync(user.AvatarImageId.Value);
            }

            return new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                AvatarUrl = avatarUrl,
                CreatedAt = user.CreatedAt
            };
        }
    }
}