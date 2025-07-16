using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
using RecipeNest.API.Entities;
using RecipeNest.API.Models;
using RecipeNest.API.Services;

namespace RecipeNest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly AuthService _auth;

        public AuthController(AppDbContext db, AuthService auth)
        {
            _db = db;
            _auth = auth;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            // 🔐 ADMIN OVERRIDE LOGIN
            if (dto.Email == "admin@recipenest.com" && dto.Password == "Admin@123")
            {
                var admin = new FoodLover
                {
                    UserId = Guid.NewGuid(), // fake ID for frontend session
                    Name = "Admin",
                    Email = dto.Email,
                    Role = "Admin"
                };

                var token = _auth.CreateToken(admin);
                return Ok(new { Token = token, admin.Role, admin.UserId, admin.Name });
            }

            // 👤 NORMAL USER LOGIN
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !_auth.VerifyPassword(user, dto.Password))
                return Unauthorized("Invalid credentials");

            user.LastLogin = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var tokenUser = _auth.CreateToken(user);
            return Ok(new { Token = tokenUser, user.Role, user.UserId, user.Name, user.LastLogin });
        }

        [HttpPut("change-password")]
        [Authorize(Roles = "Chef,FoodLover")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDtos dto)
        {
            var userId = _auth.GetUserId(User);
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user is null) return NotFound("User not found");

            if (!_auth.VerifyPassword(user, dto.CurrentPassword))
                return BadRequest("Current password is incorrect");

            user.PasswordHash = _auth.HashPassword(user, dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok("Password changed successfully");
        }

        [HttpDelete("delete-account")]
        [Authorize(Roles = "Chef,FoodLover")]
        public async Task<IActionResult> DeleteOwnAccount()
        {
            var userId = _auth.GetUserId(User);
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return Ok("Account deleted");
        }
    }
}
