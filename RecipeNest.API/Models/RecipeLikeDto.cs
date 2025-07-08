namespace RecipeNest.API.Models
{
    public class RecipeLikeDto
    {
        public Guid RecipeId { get; set; }
        public Guid UserId { get; set; }
    }
}
