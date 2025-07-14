namespace RecipeNest.API.Models
{
    public class ChefWriteDto
    {
        public string Name { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
    }

    public class ChefReadDto
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public int RecipesCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TotalLikes { get; set; }
        public int Followers { get; set; }
        public double AvgRating { get; set; }
    }
}
