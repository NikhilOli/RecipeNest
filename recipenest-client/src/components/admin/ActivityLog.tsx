import { useEffect, useState } from "react";
import API from "@/services/api";

type ActivityEvent =
    | { type: "user"; date: string; user: string }
    | { type: "recipe"; date: string; user: string; recipe: string }
    | { type: "like"; date: string; user: string; recipe: string }
    | { type: "follow"; date: string; user: string; target: string }
    | { type: "rating"; date: string; user: string; recipe: string; stars: number };

export default function ActivityLog() {
    const [activity, setActivity] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
        API.get("/admin/users"),      // you get createdAt
        API.get("/recipes"),    // you get createdAt, chef
        API.get("/admin/likes"),      // you get user, recipe, createdAt/likedAt
        API.get("/admin/follows"),    // you get follower, following, followedAt
        API.get("/admin/ratings"),    // you get user, recipe, stars, createdAt
        ])
        .then(([usersRes, recipesRes, likesRes, followsRes, ratingsRes]) => {
            const users = usersRes.data.map((u: any) => ({
            type: "user",
            date: u.createdAt,
            user: u.name,
        }));

        const recipes = recipesRes.data.map((r: any) => ({
            type: "recipe",
            date: r.createdAt,
            user: r.Chef?.Name || r.chefName || "Chef", // adjust per your data
            recipe: r.Title,
        }));

        const likes = likesRes.data.map((l: any) => ({
            type: "like",
            date: l.likedAt || l.createdAt, 
            user: l.User?.Name || l.userName,
            recipe: l.Recipe?.Title || l.recipeTitle,
        }));

        const follows = followsRes.data.map((f: any) => ({
            type: "follow",
            date: f.FollowedAt || f.followedAt,
            user: f.FollowerName,
            target: f.FollowingName,
        }));

        const ratings = ratingsRes.data.map((r: any) => ({
            type: "rating",
            date: r.createdAt,
            user: r.User?.Name,
            recipe: r.Recipe?.Title,
            stars: r.Stars,
        }));

        const merged: ActivityEvent[] = [
            ...users,
            ...recipes,
            ...likes,
            ...follows,
            ...ratings,
        ].filter(e => e.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setActivity(merged.slice(0, 50)); // show latest 50
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-gray-400 p-8">Loading activity...</div>;

    return (
        <div className="bg-[#1e1e1e] rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
        <ul className="divide-y divide-gray-700">
            {activity.map((event, i) => (
            <li key={i} className="py-3 text-gray-200 flex items-center gap-2">
                <span className="text-xs text-[#ffe066] w-32"> {new Date(event.date).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })}</span>
                {event.type === "user" && (
                <span>
                    <span className="font-semibold text-[#4ecdc4]">{event.user}</span> joined the platform
                </span>
                )}
                {event.type === "recipe" && (
                <span>
                    <span className="font-semibold text-[#4ecdc4]">{event.user}</span> created recipe
                    <span className="font-semibold text-[#ff6b6b] ml-1">{event.recipe}</span>
                </span>
                )}
                {event.type === "like" && (
                <span>
                    <span className="font-semibold text-[#4ecdc4]">{event.user}</span> liked
                    <span className="ml-1 font-semibold text-[#ff6b6b]">{event.recipe}</span>
                </span>
                )}
                {event.type === "follow" && (
                <span>
                    <span className="font-semibold text-[#4ecdc4]">{event.user}</span> followed
                    <span className="ml-1 font-semibold text-[#ff6b6b]">{event.target}</span>
                </span>
                )}
                {event.type === "rating" && (
                <span>
                    <span className="font-semibold text-[#4ecdc4]">{event.user}</span> gave
                    <span className="mx-1 text-[#ffe066] font-semibold">{event.stars}★</span>
                    to <span className="font-semibold text-[#ff6b6b]">{event.recipe}</span>
                </span>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
}
