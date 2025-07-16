import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import RecipeCard from "../recipe/RecipeCard";
import ConfirmDialog from "../ConfirmDialog";
import EditRecipeModal from "../recipe/EditRecipeModal";
import type { Recipe } from "@/types/types";


export default function MyRecipes() {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        if (user?.userId) {
        fetchRecipes(user.userId);
        }
    }, [user?.userId]);

    const fetchRecipes = async (userId: string) => {
    setLoading(true);
    try {
        const res = await API.get<Recipe[]>(`/recipes/by-chef/${userId}`);
        setRecipes(res.data);
        } catch {
        toast.error("Failed to load your recipes");
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
        await API.delete(`/recipes/${deleteId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Recipe deleted successfully");
        setDeleteId(null);
        if (user?.userId) fetchRecipes(user.userId);
        } catch {
        toast.error("Failed to delete recipe");
        }
    };

    const handleUpdate = async (updatedRecipe: Recipe) => {
        try {
        await API.put(`/recipes/${updatedRecipe.recipeId}`, updatedRecipe, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Recipe updated successfully");
        setEditRecipe(null);
        if (user?.userId) fetchRecipes(user.userId);
        } catch {
        toast.error("Failed to update recipe");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#171717]">My Recipes</h1>

        {loading ? (
            <p className="text-center text-gray-500 py-12">Loading your recipes...</p>
        ) : recipes.length === 0 ? (
            <p className="text-center text-gray-500 py-12">You have no recipes yet.</p>
        ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
                <RecipeCard
                key={recipe.recipeId}
                recipe={recipe}
                onEdit={() => setEditRecipe(recipe)}
                onDelete={() => setDeleteId(recipe.recipeId)}
                />
            ))}
            </div>
        )}

        <ConfirmDialog
            open={!!deleteId}
            title="Delete Recipe"
            description="Are you sure you want to delete this recipe? This action cannot be undone."
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
        />

        {editRecipe && (
            <EditRecipeModal
            recipe={editRecipe}
            onClose={() => setEditRecipe(null)}
            onSave={handleUpdate}
            />
        )}
        </div>
    );
}
