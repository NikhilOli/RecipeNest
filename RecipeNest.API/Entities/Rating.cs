namespace RecipeNest.API.Entities
{
    public class Rating
    {
        public Guid RatingId { get; set; } = Guid.NewGuid();
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
