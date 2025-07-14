import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Heart, Star } from "lucide-react";
import API from "@/services/api";
import type { RecipeDetailProps } from "@/types/types";

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null as RecipeDetailProps | null);
    const navigate = useNavigate();

    useEffect(() => {
        API.get(`/recipes/${id}`).then(res => setRecipe(res.data));
    }, [id]);

    if (!recipe) return <div className="text-center py-24">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <Card className="bg-[#1e1e1e] border-none shadow-xl">
            <CardContent className="p-8">
            <img
                src={recipe.imageUrl || "/default-recipe.jpg"}
                alt={recipe.title}
                className="w-full max-h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-3xl font-bold text-[#ff6b6b] mb-2">{recipe.title}</h2>
            <div className="flex items-center gap-3 mb-4">
                <ChefHat className="text-[#4ecdc4]" />
                <span
                className="font-semibold cursor-pointer hover:text-[#ff6b6b]"
                onClick={() => navigate(`/chefs/${recipe.userId}`)}
                >
                {recipe.chefName}
                </span>
            </div>
            <div className="mb-4">
                <h3 className="font-bold text-lg mb-1">Ingredients</h3>
                <ul className="list-disc pl-6 text-gray-300">
                {recipe.ingredients.split("\n").map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
                </ul>
            </div>
            <div className="mb-4">
                <h3 className="font-bold text-lg mb-1">Instructions</h3>
                <p className="text-gray-300 whitespace-pre-line">{recipe.instructions}</p>
            </div>
            <div className="flex gap-4 mt-6">
                <button className="flex items-center gap-2 bg-[#4ecdc4] text-black px-4 py-2 rounded hover:bg-[#3bbdb4] font-semibold">
                <Heart /> Like
                </button>
                <button className="flex items-center gap-2 bg-[#ff6b6b] text-white px-4 py-2 rounded hover:bg-[#e55d5d] font-semibold">
                <Star /> Rate
                </button>
            </div>
            </CardContent>
        </Card>
        </div>
    );
};

export default RecipeDetails;
