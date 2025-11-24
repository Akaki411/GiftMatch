using GiftMatch.api.DTOs;
using GiftMatch.Entity;
using GiftMatch.Migrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace GiftMatch.api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<ValidateTokenResponse> ValidateTokenAsync(string token);
        string GenerateJwtToken(User user);
    }

    public class AuthService : IAuthService
    {
        private readonly GiftMatchDbContext _context;
        private readonly IConfiguration _configuration;
        private Connection _connection;

        public AuthService(GiftMatchDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _connection = new Connection("settings.json");
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Пользователь с таким email уже существует");
            }

            User user = new User
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "USER"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            string token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                User = MapToUserDto(user)
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Неверный email или пароль");
            }

            string token = GenerateJwtToken(user);
            int expirationMinutes = int.Parse(_configuration["JwtSettings:ExpirationMinutes"] ?? "60");

            return new AuthResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                User = MapToUserDto(user)
            };
        }

        public async Task<ValidateTokenResponse> ValidateTokenAsync(string token)
        {
            try
            {
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                byte[] key = Encoding.UTF8.GetBytes(_connection.GetSecretKey());

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _connection.GetIssuer(),
                    ValidateAudience = true,
                    ValidAudience = _connection.GetAudience(),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                JwtSecurityToken jwtToken = (JwtSecurityToken)validatedToken;
                int userId = int.Parse(jwtToken.Claims.First(x => x.Type == "userId").Value);

                User? user = await _context.Users.FindAsync(userId);
                
                if (user == null)
                {
                    return new ValidateTokenResponse { IsValid = false, Message = "Пользователь не найден" };
                }

                return new ValidateTokenResponse
                {
                    IsValid = true,
                    User = MapToUserDto(user)
                };
            }
            catch (Exception ex)
            {
                return new ValidateTokenResponse { IsValid = false, Message = ex.Message };
            }
        }

        public string GenerateJwtToken(User user)
        {
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_connection.GetSecretKey()));
            SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            Claim[] claims = new[]
            {
                new Claim("userId", user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: _connection.GetIssuer(),
                audience: _connection.GetAudience(),
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_connection.GetJWTLifeTime()),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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