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
    public class FoodLoversController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly AuthService _auth;

        public FoodLoversController(AppDbContext db, IMapper mapper, AuthService auth)
        {
            _db = db;
            _mapper = mapper;
            _auth = auth;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(FoodLoverWriteDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already taken");

            var user = _mapper.Map<FoodLover>(dto);
            user.PasswordHash = _auth.HashPassword(user, dto.Password);
            user.Role = "FoodLover";

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var readDto = _mapper.Map<FoodLoverReadDto>(user);
            return CreatedAtAction(nameof(GetById), new { id = user.UserId }, readDto);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "FoodLover")]
        public async Task<ActionResult<FoodLoverReadDto>> GetById(Guid id)
        {
            var user = await _db.Users.OfType<FoodLover>().FirstOrDefaultAsync(u => u.UserId == id);
            return user is null ? NotFound() : Ok(_mapper.Map<FoodLoverReadDto>(user));
        }

        [HttpGet]
        public async Task<IEnumerable<FoodLoverReadDto>> GetAll() =>
            await _db.Users.OfType<FoodLover>().Select(f =>
                _mapper.Map<FoodLoverReadDto>(f)).ToListAsync();
    }
}
