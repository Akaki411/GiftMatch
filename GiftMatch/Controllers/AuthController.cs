using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost(ApiRoutes.Auth.Register)]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                AuthResponse response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpPost(ApiRoutes.Auth.CheckEmail)]
        public async Task<ActionResult<AuthResponse>> CheckEmail([FromBody] string request)
        {
            try
            {
                CheckEmailResponse response = await _authService.CheckEmailAsync(request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost(ApiRoutes.Auth.Login)]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                AuthResponse response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost(ApiRoutes.Auth.Validate)]
        public async Task<ActionResult<ValidateTokenResponse>> ValidateToken([FromBody] string token)
        {
            ValidateTokenResponse response = await _authService.ValidateTokenAsync(token);
            if (!response.IsValid)
            {
                return Unauthorized(response);
            }
            return Ok(response);
        }
    }
}