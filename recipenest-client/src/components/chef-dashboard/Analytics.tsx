import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import API from "@/services/api";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

interface AnalyticsData {
    viewsOverTime: { date: string; views: number }[];
    likesOverTime: { date: string; likes: number }[];
    followersOverTime: { date: string; followers: number }[];
    topRecipes: { title: string; views: number }[];
}

export default function Analytics() {
    const { user } = useAuth();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.userId) return;
        API.get<AnalyticsData>(`/chefs/analytics/${user.userId}`)
        .then((res) => setData(res.data))
        .catch(() => toast.error("Failed to load analytics"))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-24 text-gray-500">Loading analytics...</div>;

    if (!data) return <div className="text-center py-24 text-red-500">No analytics data available.</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-[#171717]">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recipe Views Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#4ecdc4" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            </Card>

            <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Likes Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.likesOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="likes" fill="#ff6b6b" />
                </BarChart>
            </ResponsiveContainer>
            </Card>

            <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Followers Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.followersOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="followers" stroke="#b39ddb" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            </Card>

            <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Top Recipes by Views</h2>
            <ul className="space-y-2 max-h-64 overflow-auto">
                {data.topRecipes.map(({ title, views }) => (
                <li key={title} className="flex justify-between border-b border-gray-200 pb-2">
                    <span>{title}</span>
                    <span className="font-semibold">{views}</span>
                </li>
                ))}
            </ul>
            </Card>
        </div>
        </div>
    );
}
