using GiftMatch.api.Constants;
using GiftMatch.api.DTOs;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet(ApiRoutes.User.GetAll)]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers([FromQuery] string? searchName)
        {
            List<UserDto> users = await _userService.GetAllUsersAsync(searchName);
            return Ok(users);
        }

        [HttpGet(ApiRoutes.User.GetCurrent)]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            int userId = GetCurrentUserId();
            UserDto user = await _userService.GetUserByIdAsync(userId);
            return Ok(user);
        }

        [HttpGet(ApiRoutes.User.GetById)]
        public async Task<ActionResult<UserDto>> GetUser(int userId)
        {
            UserDto user = await _userService.GetUserByIdAsync(userId);
            return Ok(user);
        }

        [HttpPut(ApiRoutes.User.UpdateCurrent)]
        public async Task<ActionResult<UserDto>> UpdateCurrentUser([FromBody] UpdateUserRequest request)
        {
            int userId = GetCurrentUserId();
            UserDto user = await _userService.UpdateUserAsync(userId, request);
            return Ok(user);
        }

        [HttpPut(ApiRoutes.User.UpdateById)]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<UserDto>> UpdateUser(int userId, [FromBody] UpdateUserRequest request)
        {
            UserDto user = await _userService.UpdateUserAsync(userId, request);
            return Ok(user);
        }
    }
}