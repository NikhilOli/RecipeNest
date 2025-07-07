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

            CreateMap<FoodLoverWriteDto, FoodLover>();
            CreateMap<FoodLover, FoodLoverReadDto>();

            CreateMap<Recipe, RecipeReadDto>()
                .ForMember(dest => dest.ChefName, opt => opt.MapFrom(src => src.Chef!.Name));

            CreateMap<RecipeCreateDto, Recipe>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ReverseMap();

        }
    }
}
