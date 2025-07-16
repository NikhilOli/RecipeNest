namespace RecipeNest.API.Models
{
    public class UserDto
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Role { get; set; } = "";
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }

        // Chef-specific
        public int? FollowersCount { get; set; }
        public int? RecipesCount { get; set; }
        public double? AvgRating { get; set; }

        // FoodLover-specific
        public int? LikedRecipesCount { get; set; }
        public int? CommentsCount { get; set; }
        public int? FollowedChefsCount { get; set; }
    }
}
