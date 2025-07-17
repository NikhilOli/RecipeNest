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
        public int Stars { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string RecipeId { get; set; }
        public string RecipeTitle { get; set; }
    }

    public class RatingUpdateDto
    {
        public Guid RatingId { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
    }
}
