using AutoMapper;
using RecipeNest.API.Entities;
using RecipeNest.API.Models;

namespace RecipeNest.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ChefWriteDto, Chef>();
            CreateMap<Chef, ChefReadDto>();
            CreateMap<Recipe, RecipeReadDto>()
                .ForMember(dest => dest.ChefName, opt => opt.MapFrom(src => src.Chef!.Name));
            CreateMap<RecipeCreateDto, Recipe>();
        }
    }
}
