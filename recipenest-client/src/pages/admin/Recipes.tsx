import { useEffect, useState } from "react";
import API from "@/services/api";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useNavigate } from "react-router-dom";

interface Recipe {
    recipeId: string;
    title: string;
    imageUrl?: string;
    createdAt: string;
    isPublished?: boolean;
    chef: {
        chefName: string;
    };
    likes: number;
    avgRating: number;
}

export default function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = () => {
        setLoading(true);
        API.get<Recipe[]>("/recipes")
        .then((res) => {
            setRecipes(res.data);
        })
        .catch(() => toast.error("Failed to load recipes"))
        .finally(() => setLoading(false));
    };

    const openConfirm = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setConfirmOpen(true);
    };

    const handleDelete = () => {
        if (!selectedRecipe) return;
        API.delete(`/recipes/${selectedRecipe.recipeId}`)
        .then(() => {
            toast.success("Recipe deleted");
            setRecipes((prev) => prev.filter((r) => r.recipeId !== selectedRecipe.recipeId));
        })
        .catch(() => toast.error("Deletion failed"))
        .finally(() => {
            setConfirmOpen(false);
            setSelectedRecipe(null);
        });
    };

    const filteredRecipes = recipes.filter(
        (r) =>
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.chef?.chefName.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="text-center p-16">Loading recipes...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-[#ff6b6b]">Recipes</h2>

        <input
            type="text"
            placeholder="Search by title or author"
            className="p-2 w-full max-w-md rounded border border-gray-600 bg-[#121212] text-white placeholder-gray-500 mb-6"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        {filteredRecipes.length === 0 ? (
            <p className="text-center text-gray-400">No recipes found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
                <Card key={recipe.recipeId} className="bg-[#1e1e1e] border-none shadow">
                <CardContent className="flex flex-col">
                    {recipe.imageUrl && (
                    <img
                        src={`https://localhost:7288/${recipe.imageUrl}`}
                        alt={recipe.title}
                        className="w-full h-40 object-cover rounded mb-4"
                    />
                    )}
                    <h3 className="text-xl font-semibold text-[#ff6b6b] mb-1 truncate">
                    {recipe.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">By {recipe.chef?.chefName ?? "Unknown"}</p>
                    {recipe.isPublished !== undefined && (
                    <p
                        className={`mb-2 font-semibold ${
                        recipe.isPublished ? "text-green-400" : "text-yellow-400"
                        }`}
                    >
                        {recipe.isPublished ? "Published" : "Draft"}
                    </p>
                    )}
                    <div className="flex justify-between text-gray-400 text-sm mb-4">
                    <span>Likes: {recipe.likes}</span>
                    <span>
                        Rating:{" "}
                        {typeof recipe.avgRating === "number"
                        ? recipe.avgRating.toFixed(1)
                        : "N/A"}
                    </span>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                    <Button
                        onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                        variant="outline"
                        className="text-sm cursor-pointer"
                    >
                        View
                    </Button>
                    <Button
                        variant="destructive"
                        className="text-sm cursor-pointer"
                        onClick={() => openConfirm(recipe)}
                    >
                        Delete
                    </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}

        <ConfirmDialog
            open={confirmOpen}
            title="Delete Recipe"
            description={`Are you sure you want to delete "${selectedRecipe?.title}"?`}
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
        />
        </div>
    );
}
