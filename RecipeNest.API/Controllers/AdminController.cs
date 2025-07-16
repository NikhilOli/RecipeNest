using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
using RecipeNest.API.Entities;
using RecipeNest.API.Models;

namespace RecipeNest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        private bool IsAdmin(User user) => user.Role == "Admin";

        // GET ALL USERS
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var chefs = await _db.Chefs
                .Select(c => new UserDto
                {
                    UserId = c.UserId,
                    Name = c.Name,
                    Email = c.Email,
                    Role = c.Role,
                    Bio = c.Bio,
                    CreatedAt = c.CreatedAt,
                    FollowersCount = c.Followers.Count(),
                    RecipesCount = c.Recipes.Count(),
                    AvgRating = c.Recipes.SelectMany(r => r.Ratings).Average(r => (double?)r.Stars) ?? 0
                })
                .ToListAsync();

            var foodLovers = await _db.FoodLovers
                .Select(f => new UserDto
                {
                    UserId = f.UserId,
                    Name = f.Name,
                    Email = f.Email,
                    Role = f.Role,
                    CreatedAt = f.CreatedAt,
                    LikedRecipesCount = f.LikedRecipes.Count(),
                    CommentsCount = _db.Ratings.Count(r => r.UserId == f.UserId && r.Comment != null),
                    FollowedChefsCount = f.Following.Count()
                })
                .ToListAsync();

            var users = chefs.Cast<UserDto>().Concat(foodLovers).ToList();

            return Ok(users);
        }
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            // Try find user role first
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (user.Role == "Chef")
            {
                var chef = await _db.Chefs
                    .Where(c => c.UserId == id)
                    .Select(c => new
                    {
                        c.UserId,
                        c.Name,
                        c.Email,
                        c.Role,
                        c.Bio,
                        c.CreatedAt,
                        LastLogin = (DateTime?)null, // Add this if you track last login, else null
                        RecipesCount = c.Recipes.Count(),
                        FollowersCount = c.Followers.Count(),
                        AvgRating = c.Recipes.SelectMany(r => r.Ratings).Average(r => (double?)r.Stars) ?? 0.0
                    })
                    .FirstOrDefaultAsync();

                if (chef == null) return NotFound();

                return Ok(chef);
            }
            else if (user.Role == "FoodLover")
            {
                var foodLover = await _db.FoodLovers
                    .Where(f => f.UserId == id)
                    .Select(f => new
                    {
                        f.UserId,
                        f.Name,
                        f.Email,
                        f.Role,
                        Bio = (string?)null,
                        f.CreatedAt,
                        LastLogin = (DateTime?)null,
                        LikedRecipesCount = f.LikedRecipes.Count(),
                        CommentsCount = _db.Ratings.Count(r => r.UserId == id && r.Comment != null),
                        FollowedChefsCount = f.Following.Count()
                    })
                    .FirstOrDefaultAsync();

                if (foodLover == null) return NotFound();

                return Ok(foodLover);
            }
            else
            {
                // Fallback for any other roles or users without role
                var simpleUser = new
                {
                    user.UserId,
                    user.Name,
                    user.Email,
                    user.Role,
                    Bio = (string?)null,
                    user.CreatedAt,
                    LastLogin = (DateTime?)null
                };

                return Ok(simpleUser);
            }
        }
        // DELETE USER
        [HttpDelete("users/{id:guid}")]
        [Authorize(Roles = "Admin,Chef,FoodLover")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return Ok("User deleted");
        }

        // GET ALL RATINGS
        [HttpGet("ratings")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllRatings()
        {
            var ratings = await _db.Ratings.Include(r => r.Recipe).Include(r => r.User).ToListAsync();
            return Ok(ratings);
        }

        // GET ALL LIKES
        [HttpGet("likes")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllLikes()
        {
            var likes = await _db.RecipeLikes.Include(l => l.Recipe).Include(l => l.User).ToListAsync();
            return Ok(likes);
        }

        // GET ALL FOLLOWS
        [HttpGet("follows")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> GetAllFollows()
        {
            var follows = await _db.Follows
                .Include(f => f.Follower)
                .Include(f => f.Following)
                .Select(f => new
                {
                    FollowerId = f.Follower.UserId,
                    FollowerName = f.Follower.Name,
                    FollowerEmail = f.Follower.Email,
                    FollowingId = f.Following.UserId,
                    FollowingName = f.Following.Name,
                    FollowingEmail = f.Following.Email,
                    f.FollowedAt
                })
                .ToListAsync();
            return Ok(follows);
        }
        [HttpGet("overview")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOverview()
        {
            var totalUsers = await _db.Users.CountAsync();
            var totalChefs = await _db.Users.CountAsync(u => u.Role == "Chef");
            var totalRecipes = await _db.Recipes.CountAsync();
            var totalLikes = await _db.RecipeLikes.CountAsync();
            var totalRatings = await _db.Ratings.CountAsync();

            var today = DateTime.UtcNow.Date;
            var usersGrowth = new List<object>();
            var recipesGrowth = new List<object>();

            // Example: last 7 days user/recipe counts
            for (int i = 6; i >= 0; i--)
            {
                var day = today.AddDays(-i);
                var usersOnDay = await _db.Users.CountAsync(u => u.CreatedAt.Date == day);
                var recipesOnDay = await _db.Recipes.CountAsync(r => r.CreatedAt.Date == day);

                usersGrowth.Add(new { date = day.ToString("yyyy-MM-dd"), count = usersOnDay });
                recipesGrowth.Add(new { date = day.ToString("yyyy-MM-dd"), count = recipesOnDay });
            }

            return Ok(new
            {
                totalUsers,
                totalChefs,
                totalRecipes,
                totalLikes,
                totalRatings,
                usersGrowth,
                recipesGrowth
            });
        }
    }
}
