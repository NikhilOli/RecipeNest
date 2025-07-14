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
        [Authorize(Roles = "Chef")]
        public async Task<ActionResult<ChefReadDto>> GetById(Guid id)
        {
            var chef = await _db.Users.OfType<Chef>()
                .FirstOrDefaultAsync(c => c.UserId == id);

            if (chef is null)
                return NotFound();

            // Manually build the DTO to include recipe count
            var recipeCount = await _db.Recipes.CountAsync(r => r.UserId == chef.UserId);

            var dto = new ChefReadDto
            {
                UserId = chef.UserId,
                Name = chef.Name,
                Bio = chef.Bio,
                RecipesCount = recipeCount
            };

            return Ok(dto);
        }

        // GET api/chefs
        public async Task<IEnumerable<ChefReadDto>> GetAll()
        {
            var chefs = await _db.Users.OfType<Chef>()
                .Select(chef => new ChefReadDto
                {
                    UserId = chef.UserId,
                    Name = chef.Name,
                    Bio = chef.Bio,
                    RecipesCount = _db.Recipes.Count(r => r.UserId == chef.UserId)
                })
                .ToListAsync();

            return chefs;
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

    }
}
