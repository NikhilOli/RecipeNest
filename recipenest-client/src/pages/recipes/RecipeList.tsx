import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";
import type { RecipeDetailProps } from "@/types/types";

const RecipeList = () => {
  const [recipes, setRecipes] = useState<RecipeDetailProps[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/recipes").then(res => setRecipes(res.data)); 
  }, []);
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
      <h2 className="text-3xl font-bold text-[#ff6b6b] mb-6">All Recipes</h2>
        <div className="mb-6 flex items-center gap-3">
            <Search className="text-[#4ecdc4]" />
            <Input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs text-white"
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredRecipes.length === 0 ? (
            <div className="col-span-full text-gray-400">No recipes found.</div>
            ) : (
            filteredRecipes.map(recipe => (
                <Card
                key={recipe.recipeId}
                className="bg-[#1e1e1e] border-none shadow hover:scale-[1.02] transition cursor-pointer"
                onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                >
                <CardContent className="p-4">
                    {recipe.imageUrl && (
                    <img src={`https://localhost:7288/${recipe.imageUrl}`} alt={recipe.title} className="w-full h-32 object-cover rounded mb-2" />
                    )}
                    <div className="font-semibold text-lg text-[#ff6b6b]">{recipe.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                    By{" "}
                    <span
                        className="underline cursor-pointer hover:text-[#4ecdc4]"
                        onClick={e => {
                        e.stopPropagation();
                        navigate(`/chefs/${recipe.userId}`);
                        }}
                    >
                        {recipe.chef.chefName ?? "Unknown"}
                    </span>
                    </div>
                    <div className="mt-2 text-gray-400 line-clamp-2">{recipe.ingredients}</div>
                    <Button
                    size="sm"
                    className="bg-[#4ecdc4] text-black mt-3 hover:bg-[#3bbdb4] cursor-pointer"
                    onClick={e => {
                        e.stopPropagation();
                        navigate(`/recipes/${recipe.recipeId}`);
                    }}
                    >
                    View Recipe
                    </Button>
                </CardContent>
                </Card>
            ))
            )}
        </div>
        </div>
    );
};

export default RecipeList;
