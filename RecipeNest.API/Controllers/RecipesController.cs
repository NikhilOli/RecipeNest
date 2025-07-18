using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
using RecipeNest.API.Entities;
using RecipeNest.API.Models;

namespace RecipeNest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public RecipesController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        // POST api/recipes
        [HttpPost]
        [Authorize(Roles = "Chef")]
        public async Task<IActionResult> Create([FromForm] RecipeCreateDto dto)
        {
            var chef = await _db.Users.OfType<Chef>()
                                      .FirstOrDefaultAsync(c => c.UserId == dto.UserId);
            if (chef == null)
                return BadRequest("Chef not found");

            string? imagePath = null;

            if (dto.Image != null)
            {
                var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var ext = Path.GetExtension(dto.Image.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(ext) || !permittedExtensions.Contains(ext))
                    return BadRequest("Only image files (.jpg, .jpeg, .png, .gif) are allowed.");

                var folderPath = Path.Combine("wwwroot", "recipe-images");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = $"{Guid.NewGuid()}_{dto.Image.FileName}";
                var fullPath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                imagePath = $"recipe-images/{fileName}";
            }

            var recipe = new Recipe
            {
                Title = dto.Title,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                UserId = dto.UserId,
                ImageUrl = imagePath,
                CreatedAt = DateTime.UtcNow
            };

            _db.Recipes.Add(recipe);
            await _db.SaveChangesAsync();

            var readDto = new RecipeReadDto
            {
                RecipeId = recipe.RecipeId,
                Title = recipe.Title,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                CreatedAt = recipe.CreatedAt,
                UserId = recipe.UserId,
                ChefName = chef.Name
            };

            return Ok(readDto);
        }

        // GET api/recipes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var recipes = await _db.Recipes
                .Select(r => new
                {
                    r.RecipeId,
                    r.Title,
                    r.Ingredients,
                    r.Instructions,
                    r.ImageUrl,
                    r.CreatedAt,
                    AvgRating = _db.Ratings
                        .Where(rt => rt.RecipeId == r.RecipeId)
                        .Average(rt => (double?)rt.Stars) ?? 0,
                    Likes = _db.RecipeLikes.Count(l => l.RecipeId == r.RecipeId),
                    Chef = new
                    {
                        r.Chef.UserId,
                        ChefName = r.Chef.Name,
                        r.Chef.Bio
                    }
                })
                .ToListAsync();

            return Ok(recipes);
        }

        // GET api/recipes/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<RecipeReadDto>> GetById(Guid id)
        {
            var recipe = await _db.Recipes.Include(r => r.Chef).FirstOrDefaultAsync(r => r.RecipeId == id);
            if (recipe == null) return NotFound();
            return Ok(_mapper.Map<RecipeReadDto>(recipe));
        }

        // GET api/recipes/by-chef/{chefId}
        [HttpGet("by-chef/{id:guid}")]
        public async Task<IActionResult> GetRecipesByChef(Guid id)
        {
            var recipes = await _db.Recipes
                .Where(r => r.UserId == id)
                .Select(r => new
                {
                    r.RecipeId,
                    r.Title,
                    r.Ingredients,
                    r.Instructions,
                    r.ImageUrl,
                    r.CreatedAt,
                    AvgRating = _db.Ratings
                        .Where(rt => rt.RecipeId == r.RecipeId)
                        .Average(rt => (double?)rt.Stars) ?? 0,
                    Likes = _db.RecipeLikes.Count(l => l.RecipeId == r.RecipeId)
                })
                .ToListAsync();

            return Ok(recipes);
        }

        // PUT api/recipes/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Chef")]
        public async Task<IActionResult> Update(Guid id, RecipeCreateDto dto)
        {
            var recipe = await _db.Recipes.FirstOrDefaultAsync(r => r.RecipeId == id);
            if (recipe == null) return NotFound();

            _mapper.Map(dto, recipe);
            recipe.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(_mapper.Map<RecipeReadDto>(recipe));
        }

        // DELETE api/recipes/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var recipe = await _db.Recipes.FindAsync(id);
            if (recipe == null) return NotFound();

            if (!string.IsNullOrEmpty(recipe.ImageUrl))
            {
                var filePath = Path.Combine("wwwroot", recipe.ImageUrl);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _db.Recipes.Remove(recipe);
            await _db.SaveChangesAsync();
            return Ok("Recipe deleted successfully");
        }
    }
}
