namespace RecipeNest.API.Entities
{
    public class FoodLover : User
    {
        public ICollection<RecipeLike> LikedRecipes { get; set; } = new List<RecipeLike>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
