import { useEffect, useState } from "react";
import RecentRecipesTable from "./RecentRecipesTable";
import API from "@/services/api";
import { toast } from "react-hot-toast";

interface Recipe {
  recipeId: string;
  title: string;
  createdAt: string;
  avgRating: number;
  likes: number;
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get<Recipe[]>("/chef/my-recipes")
      .then((res) => setRecipes(res.data))
      .catch(() => toast.error("Failed to load your recipes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-24 text-gray-500">Loading your recipes...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#171717]">My Recipes</h1>
      <RecentRecipesTable recipes={recipes} />
    </div>
  );
}
