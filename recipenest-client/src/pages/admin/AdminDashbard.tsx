import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import API from "@/services/api";
import toast from "react-hot-toast";
import {
    Users,
    BookOpen,
    Heart,
    Star,
    Users as UsersIcon,
    UserCheck,
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";

interface OverviewStats {
    totalUsers: number;
    totalChefs: number;
    totalRecipes: number;
    totalLikes: number;
    totalRatings: number;
    totalFollows?: number;
    usersGrowth: { date: string; count: number }[];
    recipesGrowth: { date: string; count: number }[];
    likesGrowth?: { date: string; count: number }[];
    ratingsGrowth?: { date: string; count: number }[];
    followsGrowth?: { date: string; count: number }[];
    topChefs?: { name: string; followers: number; recipes: number }[];
}

const COLORS = ["#4ecdc4", "#ff6b6b"];

export default function AdminDashboard() {
    const [stats, setStats] = useState<OverviewStats | null>(null);

    useEffect(() => {
        API.get<OverviewStats>("/admin/overview")
        .then((res) => setStats(res.data))
        .catch(() => toast.error("Failed to load dashboard data"));
    }, []);

    if (!stats) return <div className="p-16 text-center">Loading...</div>;

    // Calculate averages safely
    const avgLikesPerRecipe =
        stats.totalRecipes > 0 ? (stats.totalLikes / stats.totalRecipes).toFixed(1) : "0";
    const avgRatingsPerRecipe =
        stats.totalRecipes > 0 ? (stats.totalRatings / stats.totalRecipes).toFixed(1) : "0";

    const pieData = [
        { name: "Chefs", value: stats.totalChefs },
        { name: "FoodLovers", value: stats.totalUsers - stats.totalChefs },
    ];

    const dateTickFormatter = (date: string) =>
        new Date(date).toLocaleDateString(undefined, { day: "2-digit", month: "short" });

    const dateLabelFormatter = (date: string) =>
        new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        });

    return (
        <div className="space-y-10 max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-[#ff6b6b]">Dashboard Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
            icon={<Users className="w-8 h-8 text-[#4ecdc4]" />}
            label="Total Users"
            value={stats.totalUsers}
            />
            <StatCard
            icon={<UsersIcon className="w-8 h-8 text-[#ff6b6b]" />}
            label="Total Chefs"
            value={stats.totalChefs}
            />
            <StatCard
            icon={<BookOpen className="w-8 h-8 text-[#ffe066]" />}
            label="Total Recipes"
            value={stats.totalRecipes}
            />
            <StatCard
            icon={<Heart className="w-8 h-8 text-[#b39ddb]" />}
            label="Total Likes"
            value={stats.totalLikes}
            />
            <StatCard
            icon={<Star className="w-8 h-8 text-[#ff6b6b]" />}
            label="Total Ratings"
            value={stats.totalRatings}
            />
            {stats.totalFollows !== undefined && (
            <StatCard
                icon={<UserCheck className="w-8 h-8 text-[#4ecdc4]" />}
                label="Total Follows"
                value={stats.totalFollows}
            />
            )}
            <StatCard
            icon={<Heart className="w-8 h-8 text-[#4ecdc4]" />}
            label="Avg Likes / Recipe"
            value={avgLikesPerRecipe}
            />
            <StatCard
            icon={<Star className="w-8 h-8 text-[#ff6b6b]" />}
            label="Avg Ratings / Recipe"
            value={avgRatingsPerRecipe}
            />
        </div>

        {/* Growth Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
            <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">User Growth (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={stats.usersGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={dateTickFormatter} stroke="#bbb" />
                <YAxis allowDecimals={false} stroke="#bbb" />
                <Tooltip labelFormatter={dateLabelFormatter} />
                <Line type="monotone" dataKey="count" stroke="#4ecdc4" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
            </div>

            <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Recipe Growth (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={stats.recipesGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={dateTickFormatter} stroke="#bbb" />
                <YAxis allowDecimals={false} stroke="#bbb" />
                <Tooltip labelFormatter={dateLabelFormatter} />
                <Line type="monotone" dataKey="count" stroke="#ff6b6b" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </section>

        {/* Optional Extra Growth Charts */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 h-80">
            {stats.likesGrowth && (
            <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-semibold text-white mb-2">Likes Growth (Last 7 Days)</h2>
                <ResponsiveContainer width="100%" height="90%">
                <LineChart data={stats.likesGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={dateTickFormatter} stroke="#bbb" />
                    <YAxis allowDecimals={false} stroke="#bbb" />
                    <Tooltip labelFormatter={dateLabelFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#b39ddb" strokeWidth={3} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            )}
            {stats.ratingsGrowth && (
            <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-semibold text-white mb-2">Ratings Growth (Last 7 Days)</h2>
                <ResponsiveContainer width="100%" height="90%">
                <LineChart data={stats.ratingsGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={dateTickFormatter} stroke="#bbb" />
                    <YAxis allowDecimals={false} stroke="#bbb" />
                    <Tooltip labelFormatter={dateLabelFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#ffe066" strokeWidth={3} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            )}
            {stats.followsGrowth && (
            <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-semibold text-white mb-2">Follows Growth (Last 7 Days)</h2>
                <ResponsiveContainer width="100%" height="90%">
                <LineChart data={stats.followsGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={dateTickFormatter} stroke="#bbb" />
                    <YAxis allowDecimals={false} stroke="#bbb" />
                    <Tooltip labelFormatter={dateLabelFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#4ecdc4" strokeWidth={3} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            )}
        </section>

        {/* User Roles Distribution Pie Chart */}
        <section className="max-w-md mx-auto bg-[#1e1e1e] rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">User Roles Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
                >
                {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </section>

        {/* Top Chefs Bar Chart */}
        {stats.topChefs && stats.topChefs.length > 0 && (
            <section className="max-w-4xl mx-auto bg-[#1e1e1e] rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Top Chefs by Followers and Recipes</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                data={stats.topChefs}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#bbb" />
                <YAxis stroke="#bbb" />
                <Tooltip />
                <Legend />
                <Bar dataKey="followers" fill="#4ecdc4" name="Followers" />
                <Bar dataKey="recipes" fill="#ff6b6b" name="Recipes" />
                </BarChart>
            </ResponsiveContainer>
            </section>
        )}
        </div>
    );
}
