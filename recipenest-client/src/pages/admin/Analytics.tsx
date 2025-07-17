import { useEffect, useState } from "react";
import API from "@/services/api";
import toast from "react-hot-toast";
import StatCard from "@/components/admin/StatCard";
import {
  Users,
  BarChart2,
  Heart,
  Star,
  Users as UsersIcon,
  UserPlus,
  ThumbsUp,
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
} from "recharts";
import ActivityLog from "@/components/admin/ActivityLog";
import type { User } from "@/types/types";
import TopChefsPanel from "@/components/admin/TopChefsPanel";

interface DashboardStats {
  totalUsers: number;
  totalChefs: number;
  totalRecipes: number;
  totalLikes: number;
  totalRatings: number;
  usersGrowth: { date: string; count: number }[];
  recipesGrowth: { date: string; count: number }[];
  followsGrowth?: { date: string; count: number }[];
  likesGrowth?: { date: string; count: number }[];
  ratingsGrowth?: { date: string; count: number }[];
}

const COLORS = ['#ff6b6b', '#4ecdc4', '#ffe066', '#b39ddb'];

export default function Analytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    API.get<DashboardStats>("/admin/overview")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load analytics data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    API.get<User[]>("/admin/users")
      .then(res => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, []);
  
  if (loading || !stats) {
    return (
      <div className="text-center p-16 text-gray-400">
        Loading analytics...
      </div>
    );
  }
  
  // Engagement ratios calculated safely
  const avgLikesPerUser = stats.totalUsers > 0 ? (stats.totalLikes / stats.totalUsers).toFixed(2) : "0";
  const avgRatingsPerRecipe = stats.totalRecipes > 0 ? (stats.totalRatings / stats.totalRecipes).toFixed(2) : "0";
  const avgFollowsPerUser = stats.totalUsers > 0 && stats.followsGrowth ? 
    (stats.followsGrowth.reduce((acc, cur) => acc + cur.count, 0) / stats.totalUsers).toFixed(2) : null;

  const pieData = [
    { name: "Chefs", value: stats.totalChefs },
    { name: "FoodLovers", value: stats.totalUsers - stats.totalChefs },
  ];

  // Formatter for dates on X axis
  const dateFormatter = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
    }).format(new Date(date));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-extrabold text-[#ff6b6b] mb-6">Platform Analytics</h1>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <StatCard icon={<Users className="text-[#ff6b6b]" />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<UsersIcon className="text-[#4ecdc4]" />} label="Total Chefs" value={stats.totalChefs} />
        <StatCard icon={<BarChart2 className="text-[#ffe066]" />} label="Total Recipes" value={stats.totalRecipes} />
        <StatCard icon={<Heart className="text-[#b39ddb]" />} label="Total Likes" value={stats.totalLikes} />
        <StatCard icon={<Star className="text-[#ff6b6b]" />} label="Total Ratings" value={stats.totalRatings} />
        <StatCard icon={<ThumbsUp className="text-[#ff6b6b]" />} label="Avg Likes per User" value={avgLikesPerUser} />
        <StatCard icon={<Star className="text-[#4ecdc4]" />} label="Avg Ratings per Recipe" value={avgRatingsPerRecipe} />
        {avgFollowsPerUser && (
          <StatCard icon={<UserPlus className="text-[#ffe066]" />} label="Avg Follows per User" value={avgFollowsPerUser} />
        )}
      </section>

      {/* Growth Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Growth */}
        <div className="bg-[#1e1e1e] rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold text-white mb-4">User Growth (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.usersGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#bbb" tickFormatter={dateFormatter} />
              <YAxis stroke="#bbb" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#ff6b6b" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recipe Growth */}
        <div className="bg-[#1e1e1e] rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold text-white mb-4">Recipe Growth (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.recipesGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#bbb" tickFormatter={dateFormatter} />
              <YAxis stroke="#bbb" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4ecdc4" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Likes Growth */}
        {stats.likesGrowth && (
          <div className="bg-[#1e1e1e] rounded-xl p-6 shadow">
            <h2 className="text-2xl font-semibold text-white mb-4">Likes Growth (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.likesGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#bbb" tickFormatter={dateFormatter} />
                <YAxis stroke="#bbb" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#b39ddb" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Ratings Growth */}
        {stats.ratingsGrowth && (
          <div className="bg-[#1e1e1e] rounded-xl p-6 shadow">
            <h2 className="text-2xl font-semibold text-white mb-4">Ratings Growth (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.ratingsGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#bbb" tickFormatter={dateFormatter} />
                <YAxis stroke="#bbb" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ffe066" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Follows Growth */}
        {stats.followsGrowth && (
          <div className="bg-[#1e1e1e] rounded-xl p-6 shadow">
            <h2 className="text-2xl font-semibold text-white mb-4">Follows Growth (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.followsGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#bbb" tickFormatter={dateFormatter} />
                <YAxis stroke="#bbb" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4ecdc4" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Pie Chart for User Role Distribution */}
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
                <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Add the Top Chefs Panel */}
      <section>
        <TopChefsPanel users={users} />
      </section>

      {/* Add the Activity Log below or side by side */}
      <section>
        <ActivityLog />
      </section>
    </div>
  );
}
