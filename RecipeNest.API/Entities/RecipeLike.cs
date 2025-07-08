namespace RecipeNest.API.Entities
{
    public class RecipeLike
    {
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
