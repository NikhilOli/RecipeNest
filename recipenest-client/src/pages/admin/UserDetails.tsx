import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/services/api";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";

interface User {
    userId: string;
    name: string;
    email: string;
    role: string;
    bio?: string;
    createdAt: string;
    followersCount?: number;
    recipesCount?: number;
    avgRating?: number;
    likedRecipesCount?: number;
    commentsCount?: number;
    followedChefsCount?: number;
    lastLogin?: string;
}

export default function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        API.get<User>(`/admin/users/${id}`)
        .then((res) => setUser(res.data))
        .catch(() => toast.error("Failed to load user"))
        .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center p-16 text-gray-400">Loading...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 cursor-pointer">
        <Card className="bg-[#1e1e1e] border border-gray-700 shadow">
            <CardContent>
            <h2 className="text-3xl font-bold text-[#ff6b6b] mb-4">{user.name}</h2>
            <p className="text-gray-400 mb-1">Email: {user.email}</p>
            <p className="text-gray-400 mb-1">Role: {user.role}</p>
            <p className="text-gray-400 mb-2">Joined: {new Date(user.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}</p>
            {user.bio && <p className="text-gray-300 mb-4 whitespace-pre-wrap">{user.bio}</p>}
            {user.lastLogin && (
                <p className="text-gray-500 mb-4">Last login: {new Date(user.lastLogin).toLocaleString()}</p>
            )}

            {/* Role-specific info */}
            {user.role === "Chef" && (
                <div className="space-y-2 border-t border-gray-700 pt-4 text-[#4ecdc4] text-sm">
                <p>
                    <span className="font-semibold">{user.recipesCount}</span> Recipes
                </p>
                <p>
                    <span className="font-semibold">{user.followersCount}</span> Followers
                </p>
                <p>
                    Average Rating:{" "}
                    <span className="font-semibold">
                    {user.avgRating !== undefined ? user.avgRating.toFixed(1) : "N/A"}
                    </span>
                </p>
                </div>
            )}
            {user.role === "FoodLover" && (
                <div className="space-y-2 border-t border-gray-700 pt-4 text-[#ff6b6b] text-sm">
                <p>
                    <span className="font-semibold">{user.likedRecipesCount}</span> Liked Recipes
                </p>
                <p>
                    <span className="font-semibold">{user.commentsCount}</span> Comments
                </p>
                <p>
                    <span className="font-semibold">{user.followedChefsCount}</span> Chefs Followed
                </p>
                </div>
            )}
            </CardContent>
        </Card>
        </div>
    );
}
