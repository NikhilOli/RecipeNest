import { useEffect, useState } from "react";
import API from "@/services/api";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Star } from "lucide-react";

interface Rating {
    ratingId: string;
    stars: number;
    comment?: string;
    createdAt: string;
    userName: string;
    userEmail: string;
    recipeTitle: string;
    recipeId: string;
}

interface RecipeAverage {
    recipeId: string;
    title: string;
    averageRating: number;
}

export default function Ratings() {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "stars">("date");
    const [topRecipes, setTopRecipes] = useState<RecipeAverage[]>([]);

    useEffect(() => {
        API.get<Rating[]>("/admin/ratings")
        .then(res => {
            const mapped = res.data.map((r: any) => ({
            ratingId: r.RatingId || r.ratingId,
            stars: r.Stars ?? r.stars,
            comment: r.Comment || r.comment,
            createdAt: r.CreatedAt || r.createdAt,
            userName: r.User?.Name || r.userName,
            userEmail: r.User?.Email || r.userEmail,
            recipeTitle: r.Recipe?.Title || r.recipeTitle,
            recipeId: r.Recipe?.RecipeId || r.recipeId,
            }));
            setRatings(mapped);
        })
        .catch(() => toast.error("Failed to load ratings"))
        .finally(() => setLoading(false));
    }, []);    

    useEffect(() => {
        // Aggregate average rating per recipe from current ratings data
        const recipeMap: Record<string, { total: number; count: number; title: string }> = {};
        ratings.forEach(r => {
        if (!recipeMap[r.recipeId]) {
            recipeMap[r.recipeId] = { total: 0, count: 0, title: r.recipeTitle };
        }
        recipeMap[r.recipeId].total += r.stars;
        recipeMap[r.recipeId].count += 1;
        });
        const averages = Object.entries(recipeMap).map(([id, val]) => ({
        recipeId: id,
        title: val.title,
        averageRating: val.total / val.count,
        }));
        averages.sort((a, b) => b.averageRating - a.averageRating);
        setTopRecipes(averages.slice(0, 5));
    }, [ratings]);

    // Filter and sort ratings
    const filteredRatings = ratings
        .filter(r =>
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.recipeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        )
        .sort((a, b) => {
        if (sortBy === "stars") return b.stars - a.stars;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    if (loading)
        return <div className="text-center p-16 text-gray-400">Loading ratings...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
        <div>
            <h2 className="text-3xl font-bold text-[#ff6b6b] mb-6">Ratings Management</h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
                placeholder="Search by user, recipe, or comment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md flex-grow"
            />
            <Select onValueChange={(value: "date" | "stars") => setSortBy(value)} defaultValue="date">
                <SelectTrigger className="w-48">
                Sort by: {sortBy === "date" ? "Date" : "Stars"}
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="date">Date (Newest)</SelectItem>
                <SelectItem value="stars">Stars (High to Low)</SelectItem>
                </SelectContent>
            </Select>
            </div>

            <div className="space-y-6">
            {filteredRatings.length === 0 ? (
                <p className="text-gray-500">No ratings found.</p>
            ) : (
                filteredRatings.map((r) => (
                <Card key={r.ratingId} className="bg-[#1e1e1e] border border-gray-700 shadow">
                    <CardContent className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-lg truncate">{r.recipeTitle}</p>
                        <p className="text-gray-400 text-sm truncate">
                        {r.userName} ({r.userEmail})
                        </p>
                        <p className="flex items-center text-yellow-400 font-semibold text-lg mt-1">
                        {Array.from({ length: r.stars }).map((_, i) => (
                            <Star key={i} size={16} className="mr-1" />
                        ))}
                        <span className="text-gray-500 ml-2">{r.stars} stars</span>
                        </p>
                        {r.comment && <p className="text-gray-300 mt-1 line-clamp-3">{r.comment}</p>}
                        <p className="text-gray-500 text-xs mt-1">
                        Rated on: {new Date(r.createdAt).toLocaleString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        })}
                        </p>
                    </div>
                    </CardContent>
                </Card>
                ))
            )}
            </div>
        </div>

        {/* Sidebar: Top Rated Recipes */}
        <aside className="bg-[#1e1e1e] rounded-lg p-6 shadow">
            <h3 className="text-xl font-semibold text-[#4ecdc4] mb-4">Top Rated Recipes</h3>
            {topRecipes.length === 0 ? (
            <p className="text-gray-500">No data available</p>
            ) : (
            <ul className="space-y-3">
                {topRecipes.map((r) => (
                <li key={r.recipeId} className="flex justify-between text-white">
                    <span className="truncate">{r.title}</span>
                    <span className="flex items-center text-yellow-400 font-semibold">
                    {r.averageRating.toFixed(1)}
                    <Star size={14} className="ml-1" />
                    </span>
                </li>
                ))}
            </ul>
            )}
        </aside>
        </div>
    );
}
