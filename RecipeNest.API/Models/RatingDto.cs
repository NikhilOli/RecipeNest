namespace RecipeNest.API.Models
{
    public class RatingCreateDto
    {
        public Guid RecipeId { get; set; }
        public Guid UserId { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
    }

    public class RatingReadDto
    {
        public Guid RatingId { get; set; }
        public Guid RecipeId { get; set; }
        public Guid UserId { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
    }
}
