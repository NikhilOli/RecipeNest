import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecentRecipesTable({ recipes, onEdit, onDelete }: any) {
    return (
        <div className="bg-white rounded-xl shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#171717]">Recent Recipes</h3>
            <span className="text-[#4ecdc4] cursor-pointer text-sm font-semibold">View All</span>
        </div>
        <table className="w-full text-[#171717]">
            <thead>
            <tr className="text-left text-gray-500 text-sm">
                <th>Recipe Name</th>
                <th>Date Added</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {recipes.map((r: any) => (
                <tr key={r.recipeId} className="border-t">
                <td>{r.title}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>{r.views}</td>
                <td>{r.likes}</td>
                <td>
                    <Button variant="ghost" onClick={() => onEdit(r.recipeId)}><Pencil className="w-4 h-4 text-[#4ecdc4]" /></Button>
                    <Button variant="ghost" onClick={() => onDelete(r.recipeId)}><Trash2 className="w-4 h-4 text-[#ff6b6b]" /></Button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}
