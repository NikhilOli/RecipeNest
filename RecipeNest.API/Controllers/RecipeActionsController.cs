using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
using RecipeNest.API.Entities;
using RecipeNest.API.Models;

namespace RecipeNest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeActionsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public RecipeActionsController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        // POST api/recipeactions/like
        [HttpPost("like")]
        public async Task<IActionResult> LikeRecipe(Guid recipeId, Guid userId)
        {
            var user = await _db.Users.OfType<FoodLover>().FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return BadRequest("User not found or not a FoodLover");

            bool alreadyLiked = await _db.RecipeLikes
                .AnyAsync(l => l.UserId == userId && l.RecipeId == recipeId);

            if (alreadyLiked)
                return BadRequest("Recipe already liked");

            var like = new RecipeLike
            {
                RecipeId = recipeId,
                UserId = userId
            };

            _db.RecipeLikes.Add(like);
            await _db.SaveChangesAsync();

            return Ok("Recipe liked successfully");
        }

        // GET: api/recipeactions/likes/{recipeId}
        [HttpGet("likes/{recipeId:guid}")]
        public async Task<IActionResult> GetLikes(Guid recipeId)
        {
            var likes = await _db.RecipeLikes
                .Where(l => l.RecipeId == recipeId)
                .Include(l => l.User)
                .Select(l => new
                {
                    l.User.UserId,
                    l.User.Name,
                    l.User.Email
                })
                .ToListAsync();

            return Ok(likes);
        }

        // UNLIKE RECIPE /api/recipeactions/unlike?userId=...&recipeId=...
        [HttpDelete("unlike")]
        public async Task<IActionResult> UnlikeRecipe(Guid userId, Guid recipeId)
        {
            var like = await _db.RecipeLikes.FindAsync(userId, recipeId);
            if (like == null) return NotFound("Like not found");

            _db.RecipeLikes.Remove(like);
            await _db.SaveChangesAsync();
            return Ok("Recipe unliked");
        }

        // POST api/recipeactions/rate
        [HttpPost("rate")]
        public async Task<IActionResult> RateRecipe(Guid recipeId, Guid userId, int stars, string? comment)
        {
            var user = await _db.Users.OfType<FoodLover>().FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return BadRequest("User not found or not a FoodLover");

            var rating = new Rating
            {
                RecipeId = recipeId,
                UserId = userId,
                Stars = stars,
                Comment = comment
            };

            _db.Ratings.Add(rating);
            await _db.SaveChangesAsync();

            return Ok("Recipe rated successfully");
        }
        // GET: api/recipeactions/ratings/{recipeId}
        [HttpGet("ratings/{recipeId:guid}")]
        public async Task<IActionResult> GetRatings(Guid recipeId)
        {
            var ratings = await _db.Ratings
                .Where(r => r.RecipeId == recipeId)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.Stars,
                    r.Comment,
                    r.User.UserId,
                    r.User.Name,
                    r.User.Email
                })
                .ToListAsync();

            return Ok(ratings);
        }

        // UPDATE RATING /api/recipeactions/rate
        [HttpPut("rate")]
        public async Task<IActionResult> UpdateRating([FromBody] RatingUpdateDto dto)
        {
            var rating = await _db.Ratings.FindAsync(dto.RatingId);
            if (rating == null) return NotFound("Rating not found");

            rating.Stars = dto.Stars;
            rating.Comment = dto.Comment;
            rating.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok("Rating updated");
        }

    }
}
