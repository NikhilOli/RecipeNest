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
            var chef = await _db.Users.OfType<Chef>().FirstOrDefaultAsync(c => c.UserId == id);
            return chef is null ? NotFound() : Ok(_mapper.Map<ChefReadDto>(chef));
        }

        // GET api/chefs
        [HttpGet]
        public async Task<IEnumerable<ChefReadDto>> GetAll() =>
            await _db.Users.OfType<Chef>()
                .Select(f => _mapper.Map<ChefReadDto>(f))
                .ToListAsync();
    }
}
