namespace RecipeNest.API.Entities
{
    public class Rating
    {
        public Guid RatingId { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public Guid FoodLoverId { get; set; }
        public FoodLover FoodLover { get; set; }

        public int Stars { get; set; }
        public string? Comment { get; set; }
    }
}
