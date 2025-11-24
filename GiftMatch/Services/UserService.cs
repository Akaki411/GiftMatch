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
    }

    public class UserService : IUserService
    {
        private readonly GiftMatchDbContext _context;

        public UserService(GiftMatchDbContext context)
        {
            _context = context;
        }

        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            User? user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }
            return MapToUserDto(user);
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
            return users.Select(MapToUserDto).ToList();
        }

        public async Task<UserDto> UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            User? user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }

            if (request.FirstName != null)
            {
                user.FirstName = request.FirstName;
            }

            if (request.LastName != null)
            {
                user.LastName = request.LastName;
            }

            if (request.AvatarImageId.HasValue)
            {
                user.AvatarImageId = request.AvatarImageId.Value;
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return MapToUserDto(user);
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                AvatarImageId = user.AvatarImageId,
                CreatedAt = user.CreatedAt
            };
        }
    }
}