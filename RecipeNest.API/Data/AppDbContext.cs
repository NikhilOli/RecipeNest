using Microsoft.EntityFrameworkCore;
using RecipeNest.API.Entities;

namespace RecipeNest.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        // One DbSet per entity (use plural names)
        public DbSet<User> Users => Set<User>();
        public DbSet<Chef> Chefs => Set<Chef>();
        public DbSet<FoodLover> FoodLovers => Set<FoodLover>();
        public DbSet<Recipe> Recipes => Set<Recipe>();
        public DbSet<RecipeLike> RecipeLikes => Set<RecipeLike>();
        public DbSet<Rating> Ratings => Set<Rating>();
        public DbSet<Follow> Follows => Set<Follow>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasDiscriminator<string>(u => u.Role)
                .HasValue<Chef>("Chef")
                .HasValue<FoodLover>("FoodLover");

            modelBuilder.Entity<RecipeLike>().HasKey(x => new { x.UserId, x.RecipeId });
            modelBuilder.Entity<Rating>().HasKey(x => x.RatingId);

            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.Chef)
                .WithMany(c => c.Recipes)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follow>()
                .HasKey(f => new { f.FollowerId, f.FollowingId });

            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Follower)
                .WithMany(f => f.Following)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Following)
                .WithMany(c => c.Followers)
                .HasForeignKey(f => f.FollowingId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
