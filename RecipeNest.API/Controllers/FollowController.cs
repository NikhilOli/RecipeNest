using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
using RecipeNest.API.Entities;

namespace RecipeNest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly AppDbContext _db;

        public FollowController(AppDbContext db)
        {
            _db = db;
        }

        // POST: api/follow
        [HttpPost]
        public async Task<IActionResult> FollowChef(Guid followerId, Guid followingId)
        {
            if (followerId == followingId)
                return BadRequest("Cannot follow yourself");

            var follower = await _db.Users.OfType<FoodLover>().FirstOrDefaultAsync(f => f.UserId == followerId);
            var following = await _db.Users.OfType<Chef>().FirstOrDefaultAsync(c => c.UserId == followingId);

            if (follower == null || following == null)
                return NotFound("Follower or following user not found");

            bool alreadyFollowing = await _db.Follows.AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);
            if (alreadyFollowing)
                return BadRequest("Already following this chef");

            var follow = new Follow
            {
                FollowerId = followerId,
                FollowingId = followingId
            };

            _db.Follows.Add(follow);
            await _db.SaveChangesAsync();

            return Ok("Followed successfully");
        }

        // GET: api/follow/followers/{chefId}
        [HttpGet("followers/{chefId:guid}")]
        public async Task<IActionResult> GetFollowers(Guid chefId)
        {
            var followers = await _db.Follows
                .Include(f => f.Follower)
                .Where(f => f.FollowingId == chefId)
                .Select(f => new
                {
                    f.Follower.UserId,
                    f.Follower.Name,
                    f.Follower.Email
                })
                .ToListAsync();

            return Ok(followers);
        }

        // GET: api/follow/following/{foodLoverId}
        [HttpGet("following/{foodLoverId:guid}")]
        public async Task<IActionResult> GetFollowing(Guid foodLoverId)
        {
            var following = await _db.Follows
                .Include(f => f.Following)
                .Where(f => f.FollowerId == foodLoverId)
                .Select(f => new
                {
                    f.Following.UserId,
                    f.Following.Name,
                    f.Following.Email,
                    f.FollowedAt
                })
                .ToListAsync();

            return Ok(following);
        }

        // UNFOLLOW CHEF /api/recipeactions/unfollow?followerId=...&followingId=...
        [HttpDelete("unfollow")]
        public async Task<IActionResult> UnfollowChef(Guid followerId, Guid followingId)
        {
            var follow = await _db.Follows.FindAsync(followerId, followingId);
            if (follow == null) return NotFound("Follow relationship not found");

            _db.Follows.Remove(follow);
            await _db.SaveChangesAsync();
            return Ok("Unfollowed successfully");
        }


    }
}
