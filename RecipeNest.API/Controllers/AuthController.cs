using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
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
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !_auth.VerifyPassword(user, dto.Password))
                return Unauthorized("Invalid credentials");

            var token = _auth.CreateToken(user);
            return Ok(new { Token = token, user.Role, user.UserId, user.Name });
        }
    }
}
