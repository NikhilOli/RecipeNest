using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
using RecipeNest.API.Entities;

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
            var users = await _db.Users.ToListAsync();
            return Ok(users);
        }

        // DELETE USER
        [HttpDelete("users/{id:guid}")]
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
        public async Task<IActionResult> GetAllRatings()
        {
            var ratings = await _db.Ratings.Include(r => r.Recipe).Include(r => r.User).ToListAsync();
            return Ok(ratings);
        }

        // GET ALL LIKES
        [HttpGet("likes")]
        public async Task<IActionResult> GetAllLikes()
        {
            var likes = await _db.RecipeLikes.Include(l => l.Recipe).Include(l => l.User).ToListAsync();
            return Ok(likes);
        }

        // GET ALL FOLLOWS
        [HttpGet("follows")]
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
    }
}
