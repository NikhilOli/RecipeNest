import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { Recipe } from "@/types/types";



interface EditRecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    onSave: (updatedRecipe: Recipe) => void | Promise<void>;
}

export default function EditRecipeModal({ recipe, onClose, onSave }: EditRecipeModalProps) {
    const [title, setTitle] = useState(recipe.title);
    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [instructions, setInstructions] = useState(recipe.instructions);
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
    if (!title || !ingredients || !instructions) {
        toast.error("Please fill all fields");
        return;
    }
    setLoading(true);
    onSave({
        ...recipe,
        title,
        ingredients,
        instructions,
        });
        setLoading(false);
    };

    return (
        <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">Edit Recipe</Dialog.Title>
            <div className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={4} />
            </div>
            <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={6} />
            </div>
            {/* Image upload can be added here if needed */}
            </div>
            <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            </div>
        </Dialog.Content>
        </Dialog.Root>
    );
}
