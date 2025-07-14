import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import API from "@/services/api";

interface Recipe {
    recipeId: string;
    title: string;
    createdAt: string;
    }

    export default function MyRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        API.get("/chef/my-recipes").then(res => setRecipes(res.data));
    }, []);

    const handleEdit = (id: string) => {
        // Navigate or open edit modal
        alert(`Edit recipe ${id}`);
    };

    const handleDelete = (id: string) => {
        // Confirm and delete
        if (confirm("Are you sure you want to delete this recipe?")) {
        API.delete(`/recipes/${id}`).then(() => {
            setRecipes(prev => prev.filter(r => r.recipeId !== id));
        });
        }
    };

    return (
        <div>
        <h1 className="text-3xl font-bold mb-8 text-[#171717]">My Recipes</h1>
        {recipes.length === 0 ? (
            <p className="text-gray-500">You have no recipes yet.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recipes.map(({ recipeId, title, createdAt }) => (
                <Card key={recipeId} className="bg-white shadow rounded-lg">
                <CardContent className="flex justify-between items-center">
                    <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-gray-500 text-sm">
                        Created: {new Date(createdAt).toLocaleDateString()}
                    </p>
                    </div>
                    <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => handleEdit(recipeId)}>
                        <Pencil className="w-5 h-5 text-[#4ecdc4]" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(recipeId)}>
                        <Trash2 className="w-5 h-5 text-[#ff6b6b]" />
                    </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
        </div>
    );
}
