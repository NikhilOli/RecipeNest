namespace RecipeNest.API.Entities
{
    public class RecipeLike
    {
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public Guid FoodLoverId { get; set; }
        public FoodLover FoodLover { get; set; }
    }
}
