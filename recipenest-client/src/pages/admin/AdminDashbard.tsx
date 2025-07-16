import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import API from "@/services/api";
import { Users, BookOpen, Heart, Star } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface OverviewStats {
    totalUsers: number;
    totalChefs: number;
    totalRecipes: number;
    totalLikes: number;
    totalRatings: number;
    usersGrowth: { date: string; count: number }[];
    recipesGrowth: { date: string; count: number }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<OverviewStats | null>(null);

    useEffect(() => {
        API.get<OverviewStats>("/admin/overview")
        .then((res) => setStats(res.data))
        .catch(() => {})
    }, []);

    if (!stats) return <div className="p-16 text-center">Loading...</div>;

    const statCards = [
        { icon: <Users className="w-8 h-8 text-[#4ecdc4]" />, label: "Users", value: stats.totalUsers },
        { icon: <BookOpen className="w-8 h-8 text-[#ff6b6b]" />, label: "Recipes", value: stats.totalRecipes },
        { icon: <Heart className="w-8 h-8 text-[#ffe066]" />, label: "Likes", value: stats.totalLikes },
        { icon: <Star className="w-8 h-8 text-[#b39ddb]" />, label: "Ratings", value: stats.totalRatings },
    ];

    return (
        <div className="space-y-8">
        <h1 className="text-4xl font-extrabold text-[#ff6b6b]">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {statCards.map(({ icon, label, value }) => (
            <StatCard key={label} icon={icon} label={label} value={value} />
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.usersGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="date"
                    tickFormatter={(date) =>
                        new Intl.DateTimeFormat("en-US", {
                        day: "2-digit",
                        month: "short",
                        }).format(new Date(date))
                    }
                />
                <YAxis />
                <Tooltip labelFormatter={(label) =>
                    new Intl.DateTimeFormat("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        }).format(new Date(label))
                    }
                />
                <Line type="monotone" dataKey="count" stroke="#4ecdc4" strokeWidth={2} />
            </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.recipesGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="date"
                    tickFormatter={(date) =>
                        new Intl.DateTimeFormat("en-US", {
                        day: "2-digit",
                        month: "short",
                        }).format(new Date(date))
                    }
                />
                <YAxis />
                <Tooltip labelFormatter={(label) =>
                    new Intl.DateTimeFormat("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        }).format(new Date(label))
                    }
                />
                <Line type="monotone" dataKey="count" stroke="#ff6b6b" strokeWidth={2} />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}
