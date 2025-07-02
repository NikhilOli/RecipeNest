using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Entities;

namespace RecipeNest.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        // One DbSet per entity (use plural names)
        public DbSet<Chef> Chefs => Set<Chef>();
        // public DbSet<Recipe> Recipes => Set<Recipe>();
        // public DbSet<FoodLover> FoodLovers => Set<FoodLover>();
        // public DbSet<Rating> Ratings => Set<Rating>();
    }
}
