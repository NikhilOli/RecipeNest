
namespace RecipeNest.API.Entities
{
    public class Chef : User
    {
        public string Bio { get; set; } = string.Empty;

        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
        public ICollection<Follow> Followers { get; set; } = new List<Follow>();

    }
}
