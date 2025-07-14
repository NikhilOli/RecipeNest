import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";

interface Recipe {
    recipeId: string;
    title: string;
    createdAt: string;
    avgRating: number;
    likes: number;
}

interface RecentRecipesTableProps {
    recipes: Recipe[];
    onEdit?: (id: string) => void;   
    onDelete?: (id: string) => void;
    showActions?: boolean;
}


export default function RecentRecipesTable({ recipes }: RecentRecipesTableProps) {
    if (recipes.length === 0) {
        return <p className="text-gray-500 text-center">No recent recipes available.</p>;
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#171717]">Recent Recipes</h3>
            {/* You can add "View All" link here if needed */}
        </div>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Recipe Name</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Avg Rating</TableHead>
                <TableHead>Likes</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {recipes.map(({ recipeId, title, createdAt, avgRating = 0, likes = 0 }) => (
                <TableRow key={recipeId} className="cursor-pointer hover:bg-gray-100">
                <TableCell className="font-medium text-[#ff6b6b]">{title}</TableCell>
                <TableCell>
                {new Date(createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}
                </TableCell>
                <TableCell className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#ffe066]" /> {typeof avgRating === "number" ? avgRating.toFixed(1) : "N/A"}
                </TableCell>
                <TableCell>{likes}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    );
}
