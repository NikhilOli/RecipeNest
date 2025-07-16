import { Star, Heart, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Recipe {
    recipeId: string;
    title: string;
    ingredients: string;
    instructions: string;
    createdAt: string;
    avgRating: number;
    likes: number;
    imageUrl?: string;
}

interface RecipeCardProps {
    recipe: Recipe;
    onEdit: () => void;
    onDelete: () => void;
}

export default function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        {recipe.imageUrl && (
            <img
            src={`https://localhost:7288/${recipe.imageUrl}`}
            alt={recipe.title}
            className="h-48 w-full object-cover"
            loading="lazy"
            />
        )}
        <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-[#ff6b6b] mb-2">{recipe.title}</h2>
            <p className="text-gray-700 flex-grow line-clamp-3 mb-4">{recipe.ingredients}</p>
            <div className="flex justify-between items-center text-gray-600 mb-4">
            <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-[#ffe066]" />
                <span>{typeof recipe.avgRating === "number" ? recipe.avgRating.toFixed(1) : "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
                <Heart className="w-5 h-5 text-[#ff6b6b]" />
                <span>{recipe.likes}</span>
            </div>
            <div>{new Date(recipe.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })}
            </div>
            </div>
            <div className="flex gap-4">
            <Button variant="outline" className="flex-1 cursor-pointer" onClick={onEdit}>
                <Edit className="w-5 h-5 mr-2" /> Edit
            </Button>
            <Button variant="destructive" className="flex-1 cursor-pointer" onClick={onDelete}>
                <Trash2 className="w-5 h-5 mr-2" /> Delete
            </Button>
            </div>
        </div>
        </div>
    );
}
