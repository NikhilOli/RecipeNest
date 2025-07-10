using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using RecipeNest.API.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RecipeNest.API.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _hasher = new();

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string HashPassword(User user, string plainPassword) =>
            _hasher.HashPassword(user, plainPassword);

        public bool VerifyPassword(User user, string plainPassword) =>
            _hasher.VerifyHashedPassword(user, user.PasswordHash, plainPassword) == PasswordVerificationResult.Success;

        public bool IsAuthorized(User user, string requiredRole) =>
            user.Role == requiredRole;

        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
