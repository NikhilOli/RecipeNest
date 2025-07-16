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
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

  useEffect(() => {
    API.get<DashboardStats>("/admin/overview")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load analytics data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-center p-16 text-gray-400">
        Loading analytics...
      </div>
    );
  }

  // Pie data for user roles distribution (simplified example)
  const pieData = [
    { name: "Chefs", value: stats.totalChefs },
    { name: "FoodLovers", value: stats.totalUsers - stats.totalChefs },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-extrabold text-[#ff6b6b] mb-6">Platform Analytics</h1>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard icon={<Users className="text-[#ff6b6b]" />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<UsersIcon className="text-[#4ecdc4]" />} label="Total Chefs" value={stats.totalChefs} />
        <StatCard icon={<BarChart2 className="text-[#ffe066]" />} label="Total Recipes" value={stats.totalRecipes} />
        <StatCard icon={<Heart className="text-[#b39ddb]" />} label="Total Likes" value={stats.totalLikes} />
        <StatCard icon={<Star className="text-[#ff6b6b]" />} label="Total Ratings" value={stats.totalRatings} />
      </section>

      {/* Growth Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* User Growth */}
        <div className="bg-[#1e1e1e] rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold text-white mb-4">User Growth (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.usersGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#bbb" />
              <YAxis stroke="#bbb" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#ff6b6b" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recipe Growth */}
        <div className="bg-[#1e1e1e] rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold text-white mb-4">Recipe Growth (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.recipesGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#bbb" />
              <YAxis stroke="#bbb" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4ecdc4" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
              {pieData.map((entry, index) => (
                <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Placeholder for more charts: e.g. Likes growth, Follows growth, Ratings growth */}
      {/* You can extend here by fetching and adding those charts using your APIs */}
    </div>
  );
}
