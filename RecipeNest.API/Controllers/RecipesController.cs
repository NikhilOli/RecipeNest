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
        public async Task<IActionResult> Create(RecipeCreateDto dto)
        {
            var chef = await _db.Users
                .OfType<Chef>()
                .FirstOrDefaultAsync(c => c.UserId == dto.UserId);

            if (chef == null)
                return BadRequest("Chef not found with given UserId");
            var recipe = _mapper.Map<Recipe>(dto);
            _db.Recipes.Add(recipe);
            await _db.SaveChangesAsync();

            var readDto = _mapper.Map<RecipeReadDto>(recipe);
            return CreatedAtAction(nameof(GetById), new { id = recipe.RecipeId }, readDto);
        }

        // GET api/recipes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeReadDto>>> GetAll()
        {
            var recipes = await _db.Recipes.Include(r => r.Chef).ToListAsync();
            return Ok(_mapper.Map<IEnumerable<RecipeReadDto>>(recipes));
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
        [HttpGet("by-chef/{chefId:guid}")]
        public async Task<ActionResult<IEnumerable<RecipeReadDto>>> GetByChefId(Guid chefId)
        {
            var recipes = await _db.Recipes
                .Include(r => r.Chef)   
                .Where(r => r.UserId == chefId)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<RecipeReadDto>>(recipes));
        }

        // PUT api/recipes/{id}
        [HttpPut("{id:guid}")]
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
        public async Task<IActionResult> Delete(Guid id)
        {
            var recipe = await _db.Recipes.FindAsync(id);
            if (recipe == null) return NotFound();

            _db.Recipes.Remove(recipe);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
