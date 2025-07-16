import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function AddRecipe() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.userId) {
            toast.error("User not logged in");
            return;
        }

        if (!title || !ingredients || !instructions) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("Title", title);
            formData.append("Ingredients", ingredients);
            formData.append("Instructions", instructions);
            formData.append("UserId", user.userId);
            if (image) formData.append("Image", image);

            await API.post("/recipes", formData, {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // Do NOT set Content-Type here
                },
            });

            toast.success("Recipe added successfully!");
            navigate("/chef/dashboard");
            } catch (error) {
            console.error(error);
            toast.error("Failed to add recipe. Please try again.");
            } finally {
            setLoading(false);
            }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#171717]">Add New Recipe</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label className="mb-2" htmlFor="title">Title *</Label>
                <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Recipe title"
                required
                />
            </div>

            <div>
                <Label className="mb-2" htmlFor="ingredients">Ingredients *</Label>
                <Textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List ingredients separated by commas or new lines"
                rows={4}
                required
                />
            </div>

            <div>
                <Label className="mb-2" htmlFor="instructions">Instructions *</Label>
                <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Step-by-step cooking instructions"
                rows={6}
                required
                />
            </div>

            <div>
                <Label className="mb-2" htmlFor="image">Recipe Image (optional)</Label>
                <Input
                id="image"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="bg-[#4ecdc4] text-black font-semibold hover:bg-[#3bbdb4] cursor-pointer"
            >
                {loading ? "Adding..." : "Add Recipe"}
            </Button>
            </form>
        </div>
        </div>
    );                                                                                                
}
