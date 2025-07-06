
namespace RecipeNest.API.Entities
{
    public class Chef : User
    {
        public string Bio { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;

        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}
