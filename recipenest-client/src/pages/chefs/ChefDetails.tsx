import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/services/api";
import type { RecipeDetailProps } from "@/types/types";

interface ChefProps {
    userId: string;
    name: string;
    bio: string;
    email?: string;
    recipesCount?: number;
    createdAt?: string;
}

const ChefDetails = () => {
    const { id } = useParams();
    const [chef, setChef] = useState(null as ChefProps | null);
    const [recipes, setRecipes] = useState<RecipeDetailProps[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch chef details
        API.get(`chefs/${id}`).then(res => setChef(res.data));
        // Fetch chef's recipes
        API.get(`recipes/by-chef/${id}`).then(res => setRecipes(res.data));
    }, [id]);

    if (!chef) return <div className="text-center py-24">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 min-h-screen">
        <Card className="bg-[#1e1e1e] border-none shadow-xl mb-8">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div>
                <div className="w-24 h-24 rounded-full bg-[#4ecdc4] flex items-center justify-center text-4xl font-bold text-[#171717]">
                {chef.name.charAt(0)}
                </div>
            </div>
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#ff6b6b] mb-2">{chef.name}</h2>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                <ChefHat className="w-5 h-5" />
                <span>Professional Chef</span>
                </div>
                <div className="mb-2 text-gray-300">{chef.bio}</div>
                <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-[#4ecdc4]">
                    <BookOpen className="w-5 h-5" /> {chef.recipesCount} Recipes
                </span>
                {chef.email && (
                    <span className="flex items-center gap-1 text-[#ff6b6b]">
                    <Mail className="w-5 h-5" /> {chef.email}
                    </span>
                )}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                Joined: {chef.createdAt && chef.createdAt !== "0001-01-01T00:00:00" ? new Date(chef.createdAt).toLocaleDateString() : "N/A"}
                </div>
            </div>
            </CardContent>
        </Card>

        <h3 className="text-2xl font-bold text-[#4ecdc4] mb-4">Recipe Portfolio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recipes.length === 0 ? (
            <div className="col-span-full text-gray-400">No recipes yet.</div>
            ) : (
            recipes.map(recipe => (
                <Card
                key={recipe.recipeId}
                className="bg-[#1e1e1e] border-none shadow hover:scale-[1.02] transition cursor-pointer"
                onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                >
                <CardContent className="p-4">
                    {recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-32 object-cover rounded mb-2" />
                    )}
                    <div className="font-semibold text-lg text-[#ff6b6b]">{recipe.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                        Created: {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                    <Button
                    size="sm"
                    className="bg-[#4ecdc4] text-black mt-3 hover:bg-[#3bbdb4]"
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

export default ChefDetails;
