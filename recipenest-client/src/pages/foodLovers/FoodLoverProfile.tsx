import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import API from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface FoodLoverProfileProps {
    userId: string;
    name: string;
    email: string;
    bio?: string;
    createdAt: string;
}

interface RecipeLike {
    recipeId: string;
    title: string;
    imageUrl?: string;
    userId: string;
    chefName: string;
}

interface RecipeRating {
    recipeId: string;
    title: string;
    stars: number;
    comment: string;
}

interface FollowedChef {
    userId: string;
    name: string;
    email: string;
}

const FoodLoverProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<FoodLoverProfileProps | null>(null);
    const [likes, setLikes] = useState<RecipeLike[]>([]);
    const [ratings, setRatings] = useState<RecipeRating[]>([]);
    const [following, setFollowing] = useState<FollowedChef[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        API.get(`/foodlovers/${user.userId}`).then(res => setProfile(res.data));
        API.get(`/recipeactions/likes/by-user/${user.userId}`).then(res => setLikes(res.data));
        API.get(`/recipeactions/ratings/by-user/${user.userId}`).then(res => setRatings(res.data));
        API.get(`/follow/following/${user.userId}`).then(res => setFollowing(res.data));
    }, [user]);

    if (!profile) return <div className="text-center py-24">Loading profile...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-12 min-h-screen space-y-12">
        {/* Profile Card */}
        <Card className="bg-[#1e1e1e] border-none shadow-xl">
            <CardContent className="p-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#4ecdc4] flex items-center justify-center text-3xl font-bold text-[#171717]">
                {profile.name.charAt(0)}
            </div>
            <div>
                <h2 className="text-3xl font-bold text-[#ff6b6b] mb-1">{profile.name}</h2>
                <p className="text-gray-400 text-sm mb-1">{profile.email}</p>
                <p className="text-gray-300 italic min-h-[30px]">{profile.bio || "No bio provided."}</p>
                <p className="text-xs text-gray-500 mt-1">Joined: {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}</p>
            </div>
            </CardContent>
        </Card>

        {/* Liked Recipes */}
        <section>
            <h3 className="text-xl font-bold text-[#4ecdc4] mb-3">Liked Recipes</h3>
            {likes.length === 0 ? (
            <p className="text-gray-500 italic">No liked recipes yet.</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {likes.map(recipe => (
                <Card key={recipe.recipeId} className="bg-[#1e1e1e] border-none cursor-pointer hover:shadow-xl" onClick={() => navigate(`/recipes/${recipe.recipeId}`)}>
                    <CardContent className="p-4">
                    {recipe.imageUrl && (
                        <img src={`https://localhost:7288/${recipe.imageUrl}`} alt={recipe.title} className="w-full h-32 object-cover rounded mb-2" />
                    )}
                    <h4 className="font-semibold text-lg text-[#ff6b6b] line-clamp-1">{recipe.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">By {recipe.chefName}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
            )}
        </section>

        {/* My Ratings */}
        <section>
            <h3 className="text-xl font-bold text-[#ffe066] mb-3">My Ratings</h3>
            {ratings.length === 0 ? (
            <p className="text-gray-500 italic">No ratings submitted yet.</p>
            ) : (
            <ul className="space-y-4">
                {ratings.map(r => (
                <li key={r.recipeId} className="bg-[#1e1e1e] rounded p-4">
                    <div className="flex justify-between items-center">
                    <span className="text-[#ff6b6b] font-semibold cursor-pointer" onClick={() => navigate(`/recipes/${r.recipeId}`)}>
                        {r.title}
                    </span>
                    <span className="text-yellow-400 font-bold">{r.stars} ★</span>
                    </div>
                    {r.comment && <p className="text-gray-300 text-sm mt-1 italic">"{r.comment}"</p>}
                </li>
                ))}
            </ul>
            )}
        </section>

        {/* Following Chefs */}
        <section>
            <h3 className="text-xl font-bold text-[#b39ddb] mb-3">Following Chefs</h3>
            {following.length === 0 ? (
            <p className="text-gray-500 italic">You are not following any chefs.</p>
            ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {following.map(chef => (
                <li
                    key={chef.userId}
                    className="bg-[#1e1e1e] p-4 rounded shadow hover:shadow-xl cursor-pointer"
                    onClick={() => navigate(`/chefs/${chef.userId}`)}
                >
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4ecdc4] flex items-center justify-center text-xl font-bold text-[#171717]">
                        {chef.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-[#ff6b6b] font-semibold">{chef.name}</h4>
                        <p className="text-xs text-gray-400">{chef.email}</p>
                    </div>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </section>
        </div>
    );
};

export default FoodLoverProfile;
