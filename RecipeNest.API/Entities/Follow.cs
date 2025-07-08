namespace RecipeNest.API.Entities
{
    public class Follow
    {
        public Guid FollowerId { get; set; }
        public FoodLover Follower { get; set; }

        public Guid FollowingId { get; set; }
        public Chef Following { get; set; }

        public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    }
}
