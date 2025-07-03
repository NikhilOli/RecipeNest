using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Data;
using RecipeNest.API.Entities;
using RecipeNest.API.Models;
using RecipeNest.API.Services;
using AutoMapper;
using AutoMapper.QueryableExtensions;


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
        public async Task<IActionResult> Register(ChefWriteDto dto)
        {
            if (await _db.Chefs.AnyAsync(c => c.Email == dto.Email))
                return BadRequest("Email already taken");

            var chef = _mapper.Map<Chef>(dto);
            chef.PasswordHash = _auth.HashPassword(chef, dto.Password);

            _db.Chefs.Add(chef);
            await _db.SaveChangesAsync();

            var readDto = _mapper.Map<ChefReadDto>(chef);
            return CreatedAtAction(nameof(GetById), new { id = chef.ChefId }, readDto);
        }

        // GET api/chefs/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ChefReadDto>> GetById(Guid id)
        {
            var chef = await _db.Chefs.FindAsync(id);
            return chef is null ? NotFound() : Ok(_mapper.Map<ChefReadDto>(chef));
        }

        // GET api/chefs
        [HttpGet]
        public async Task<IEnumerable<ChefReadDto>> GetAll() =>
            await _db.Chefs.ProjectTo<ChefReadDto>(_mapper.ConfigurationProvider).ToListAsync();
    }
}
