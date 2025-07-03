using Microsoft.AspNetCore.Identity;
using RecipeNest.API.Entities;


namespace RecipeNest.API.Services
{
    public class AuthService
    {
        private readonly PasswordHasher<Chef> _hasher = new();

        public string HashPassword(Chef chef, string plainPw) =>
            _hasher.HashPassword(chef, plainPw);

        public bool VerifyPassword(Chef chef, string plainPw) =>
            _hasher.VerifyHashedPassword(chef, chef.PasswordHash, plainPw)
                   == PasswordVerificationResult.Success;
    }

}
