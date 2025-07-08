using Microsoft.AspNetCore.Identity;
using RecipeNest.API.Entities;

namespace RecipeNest.API.Services
{
    public class AuthService
    {
        private readonly PasswordHasher<User> _hasher = new();

        public string HashPassword(User user, string plainPassword) =>
            _hasher.HashPassword(user, plainPassword);

        public bool VerifyPassword(User user, string plainPassword) =>
            _hasher.VerifyHashedPassword(user, user.PasswordHash, plainPassword) == PasswordVerificationResult.Success;

        public bool IsAuthorized(User user, string requiredRole)
        {
            return user.Role == requiredRole;
        }
    }
}
