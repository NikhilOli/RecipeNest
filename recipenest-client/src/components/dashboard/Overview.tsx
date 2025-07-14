import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import RecentRecipesTable from "./RecentRecipesTable";
import { Heart, Star, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/services/api";

interface Recipe {
    recipeId: string;
    title: string;
    createdAt: string;
    views: number;
    likes: number;
    }

    interface Stats {
    totalRecipes: number;
    totalLikes: number;
    avgRating: number;
    followers: number;
    }

    interface OverviewProps {
    chefName: string;
    }

    export default function Overview({ chefName }: OverviewProps) {
    const [stats, setStats] = useState<Stats>({
        totalRecipes: 0,
        totalLikes: 0,
        avgRating: 0,
        followers: 0,
    });
    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        // Fetch stats and recent recipes from API
        API.get("/chef/stats").then(res => setStats(res.data));
        API.get("/chef/recent-recipes").then(res => setRecentRecipes(res.data));
    }, []);

    // Prepare stats array for StatsCard
    const statsData = [
        { icon: <BookOpen className="w-7 h-7 text-[#4ecdc4]" />, value: stats.totalRecipes, label: "Total Recipes" },
        { icon: <Heart className="w-7 h-7 text-[#ff6b6b]" />, value: stats.totalLikes, label: "Total Likes" },
        { icon: <Star className="w-7 h-7 text-[#ffe066]" />, value: stats.avgRating.toFixed(1), label: "Avg Rating" },
        { icon: <Users className="w-7 h-7 text-[#b39ddb]" />, value: stats.followers, label: "Followers" },
    ];

    return (
        <div>
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-extrabold text-[#171717] mb-1">Welcome, Chef {chefName}</h1>
            <p className="text-gray-500">Here's what's happening with your recipes</p>
            </div>
            <Button className="bg-[#ff6b6b] text-white font-semibold px-6 py-2 hover:bg-[#e55d5d]">
            + Add New Recipe
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {statsData.map(s => (
            <StatsCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
            ))}
        </div>
        <RecentRecipesTable
            recipes={recentRecipes}
            // onEdit={id => { /* handle edit */ }}
            // onDelete={id => { /* handle delete */ }}
        />
        </div>
    );
}
