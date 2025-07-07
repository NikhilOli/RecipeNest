namespace RecipeNest.API.Models
{
    public class RecipeCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Ingredients { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public Guid UserId { get; set; }
    }

    public class RecipeReadDto
    {
        public Guid RecipeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Ingredients { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid UserId { get; set; }
        public string ChefName { get; set; } = string.Empty;
    }
}
