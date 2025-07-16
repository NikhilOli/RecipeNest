using AutoMapper;
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
    public class ChefsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly AuthService _auth;

        public ChefsController(AppDbContext db, IMapper mapper, AuthService auth)
        {
            _db = db;
            _mapper = mapper;
            _auth = auth;
        }

        // POST api/chefs/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(ChefWriteDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already taken");

            var chef = _mapper.Map<Chef>(dto);
            chef.PasswordHash = _auth.HashPassword(chef, dto.Password);
            chef.Role = "Chef";

            _db.Users.Add(chef); 
            await _db.SaveChangesAsync();

            var readDto = _mapper.Map<ChefReadDto>(chef);
            return CreatedAtAction(nameof(GetById), new { id = chef.UserId }, readDto);
        }

        // GET api/chefs/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ChefReadDto>> GetById(Guid id)
        {
            var chef = await _db.Users.OfType<Chef>()
                .Include(c => c.Recipes)
                .FirstOrDefaultAsync(c => c.UserId == id);

            if (chef is null) return NotFound();

            var recipeIds = chef.Recipes.Select(r => r.RecipeId).ToList();

            var likesCount = await _db.RecipeLikes.CountAsync(l => recipeIds.Contains(l.RecipeId));
            var followersCount = await _db.Follows.CountAsync(f => f.FollowingId == chef.UserId);
            var avgRating = await _db.Ratings
                .Where(r => recipeIds.Contains(r.RecipeId))
                .AverageAsync(r => (double?)r.Stars) ?? 0;

            var dto = new ChefReadDto
            {
                UserId = chef.UserId,
                Name = chef.Name,
                Email = chef.Email,
                Bio = chef.Bio,
                RecipesCount = chef.Recipes.Count,
                CreatedAt = chef.CreatedAt,
                Followers = followersCount,
                TotalLikes = likesCount,
                AvgRating = Math.Round(avgRating, 1)
            };

            return Ok(dto);
        }

        // GET api/chefs
        public async Task<ActionResult<IEnumerable<ChefReadDto>>> GetAll()
        {
            var chefs = await _db.Users.OfType<Chef>()
                .Include(c => c.Recipes)
                .ToListAsync();

            var chefDtos = new List<ChefReadDto>();

            foreach (var chef in chefs)
            {
                var recipeIds = chef.Recipes.Select(r => r.RecipeId).ToList();

                var likesCount = await _db.RecipeLikes.CountAsync(l => recipeIds.Contains(l.RecipeId));
                var followersCount = await _db.Follows.CountAsync(f => f.FollowingId == chef.UserId);
                var avgRating = await _db.Ratings
                    .Where(r => recipeIds.Contains(r.RecipeId))
                    .AverageAsync(r => (double?)r.Stars) ?? 0;

                chefDtos.Add(new ChefReadDto
                {
                    UserId = chef.UserId,
                    Name = chef.Name,
                    Email = chef.Email,
                    Bio = chef.Bio,
                    CreatedAt = chef.CreatedAt,
                    RecipesCount = chef.Recipes.Count,
                    AvgRating = Math.Round(avgRating, 1),
                    TotalLikes = likesCount,
                    Followers = followersCount
                });
            }

            return Ok(chefDtos);
        }

        // PUT api/chefs/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Chef")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ChefWriteDto dto)
        {
            var userId = _auth.GetUserId(User);

            if (userId != id)
                return Forbid("You can only update your own profile");

            var chef = await _db.Users.OfType<Chef>().FirstOrDefaultAsync(c => c.UserId == id);
            if (chef == null)
                return NotFound("Chef not found");

            // Update fields (you can use AutoMapper if preferred)
            chef.Name = dto.Name;
            chef.Email = dto.Email;
            chef.Bio = dto.Bio ?? chef.Bio;

            await _db.SaveChangesAsync();

            return NoContent(); // or return Ok if you prefer a message
        }

        [HttpGet("stats")]
        [Authorize(Roles = "Chef")]
        public async Task<ActionResult<object>> GetStats()
        {
            var userId = _auth.GetUserId(User); // make sure AuthService has this
            var totalRecipes = await _db.Recipes.CountAsync(r => r.UserId == userId);
            var totalLikes = await _db.RecipeLikes
                .Where(l => l.Recipe.UserId == userId)
                .CountAsync();
            var avgRating = await _db.Ratings
                .Where(r => r.Recipe.UserId == userId)
                .AverageAsync(r => (double?)r.Stars) ?? 0;
            var followers = await _db.Follows.CountAsync(f => f.FollowingId == userId);

            return Ok(new
            {
                totalRecipes,
                totalLikes,
                avgRating,
                followers
            });
        }

        [HttpGet("recent-recipes")]
        [Authorize(Roles = "Chef")]
        public async Task<ActionResult<IEnumerable<RecipeReadDto>>> GetRecentRecipes()
        {
            var userId = _auth.GetUserId(User);
            var recentRecipes = await _db.Recipes
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Take(5)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<RecipeReadDto>>(recentRecipes));
        }

        [HttpGet("analytics/{id:guid}")]
        [Authorize(Roles = "Chef")]
        public async Task<IActionResult> GetChefAnalytics()
        {
            var userId = _auth.GetUserId(User);

            // Assume each recipe gets ~1 view per like or rating for mock data
            // In real app, track actual views if needed

            var recipeIds = await _db.Recipes
                .Where(r => r.UserId == userId)
                .Select(r => r.RecipeId)
                .ToListAsync();

            // Likes over time
            var likesOverTime = await _db.RecipeLikes
                .Where(l => recipeIds.Contains(l.RecipeId))
                .GroupBy(l => l.Recipe.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Likes = g.Count()
                })
                .ToListAsync();

            // Followers over time
            var followersOverTime = await _db.Follows
                .Where(f => f.FollowingId == userId)
                .GroupBy(f => f.FollowedAt.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Followers = g.Count()
                })
                .ToListAsync();

            // Simulated views over time (based on likes + ratings)
            var ratingsOverTime = await _db.Ratings
                .Where(r => recipeIds.Contains(r.RecipeId))
                .GroupBy(r => r.Recipe.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Views = g.Count()
                })
                .ToListAsync();

            // Combine likes + ratings to simulate views
            var viewsMap = new Dictionary<string, int>();
            foreach (var entry in likesOverTime)
                viewsMap[entry.Date] = entry.Likes;
            foreach (var entry in ratingsOverTime)
                viewsMap[entry.Date] = viewsMap.ContainsKey(entry.Date) ? viewsMap[entry.Date] + entry.Views : entry.Views;

            var viewsOverTime = viewsMap
                .Select(pair => new { date = pair.Key, views = pair.Value })
                .OrderBy(d => d.date)
                .ToList();

            // Top recipes by total "views" = likes + ratings
            var topRecipes = await _db.Recipes
                .Where(r => r.UserId == userId)
                .Select(r => new
                {
                    r.Title,
                    Views = _db.RecipeLikes.Count(l => l.RecipeId == r.RecipeId) +
                            _db.Ratings.Count(rt => rt.RecipeId == r.RecipeId)
                })
                .OrderByDescending(r => r.Views)
                .Take(5)
                .ToListAsync();

            return Ok(new
            {
                viewsOverTime,
                likesOverTime,
                followersOverTime,
                topRecipes
            });
        }

    }
}
