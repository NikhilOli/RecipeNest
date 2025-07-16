import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, BookOpen, Mail, Star, Heart, Users, UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/services/api";
import type { ChefProps, RecipeDetailProps } from "@/types/types";
import StatsCard from "@/components/food-lover/StatsCard";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const ChefDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [chef, setChef] = useState<ChefProps | null>(null);
    const [recipes, setRecipes] = useState<RecipeDetailProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            API.get<ChefProps>(`chefs/${id}`),
            API.get<RecipeDetailProps[]>(`recipes/by-chef/${id}`),
            user?.userId ? API.get(`/follow/followers/${id}`) : Promise.resolve({ data: [] })
        ])
            .then(([chefRes, recipesRes, followersRes]) => {
                setChef(chefRes.data);
                setRecipes(recipesRes.data);
                if (user?.userId) {
                    const followed = followersRes.data.some((f: any) => f.userId === user.userId);
                    setIsFollowing(followed);
                }
            })
            .catch(() => {
                // handle error (optional toast)
            })
            .finally(() => setLoading(false));
    }, [id, user, isFollowing]);

    const handleFollowToggle = async () => {
        if (!user) return toast.error("Login required to follow");

        try {
            if (isFollowing) {
                await API.delete(`/follow/unfollow`, {
                    params: { followerId: user.userId, followingId: id }
                });
                toast.success("Unfollowed successfully");
                setIsFollowing(false);
            } else {
                await API.post(`/follow`, null, {
                    params: { followerId: user.userId, followingId: id }
                });
                toast.success("Followed successfully");
                setIsFollowing(true);
            }
        } catch (err) {
            toast.error("Follow action failed");
        }
    };

    if (loading || !chef) {
        return <div className="text-center py-24">Loading...</div>;
    }

    // Prepare stats data for consistent rendering
    const statsData = [
        { icon: <BookOpen className="text-[#4ecdc4]" />, label: "Recipes", value: chef.recipesCount ?? 0 },
        { icon: <Heart className="text-[#ff6b6b]" />, label: "Likes", value: chef.totalLikes ?? 0 },
        { icon: <Users className="text-[#b39ddb]" />, label: "Followers", value: chef.followers ?? 0 },
        { icon: <Star className="text-[#ffe066]" />, label: "Avg Rating", value: chef.avgRating !== undefined ? chef.avgRating.toFixed(1) : "0.0" },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-12 min-h-screen space-y-10">

            {/* Profile Card */}
            <Card className="bg-[#1e1e1e] border-none shadow-xl mb-8">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div>
                        <div className="w-28 h-28 rounded-full bg-[#4ecdc4] flex items-center justify-center text-4xl font-bold text-[#171717] shadow-md">
                            {chef.name.charAt(0)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-[#ff6b6b] mb-2">{chef.name}</h2>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <ChefHat className="w-5 h-5" />
                            <span>Professional Chef</span>
                        </div>
                        <div className="mb-3 text-gray-300 min-h-[40px]">{chef.bio || <em>No bio provided.</em>}</div>
                        <div className="flex flex-wrap gap-5 mt-2 text-sm">
                            {statsData.map(({ icon, label, value }) => (
                                <StatsCard key={label} icon={icon} label={label} value={value} />
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <span>
                                <Mail className="w-4 h-4 inline" /> {chef.email}
                            </span>
                            <span>
                                Joined: {chef.createdAt && chef.createdAt !== "0001-01-01T00:00:00"
                                    ? new Date(chef.createdAt).toLocaleDateString() : "N/A"}
                            </span>
                        </div>

                        {user?.role === "FoodLover" && (
                            <Button
                                className={`mt-4 flex items-center gap-2 cursor-pointer ${isFollowing ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-[#4ecdc4] text-black hover:bg-[#3bbdb4]"}`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                {isFollowing ? "Followed" : "Follow"}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recipe Portfolio Grid */}
            <section>
                <h3 className="text-2xl font-bold text-[#4ecdc4] mb-4">Recipe Portfolio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {recipes.length === 0 ? (
                        <div className="col-span-full text-gray-400">No recipes yet.</div>
                    ) : (
                        recipes.map(recipe => (
                            <Card
                                key={recipe.recipeId}
                                className="bg-[#1e1e1e] border-none shadow hover:shadow-2xl hover:scale-[1.02] transition cursor-pointer group"
                                onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                            >
                                <CardContent className="p-4 flex flex-col">
                                    {recipe.imageUrl && (
                                        <img src={`https://localhost:7288/${recipe.imageUrl}`} alt={recipe.title} className="w-full h-2/3 object-cover rounded mb-2" />
                                    )}
                                    <div className="font-semibold text-lg text-[#ff6b6b] line-clamp-1">{recipe.title}</div>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                        <span>Created: {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : "N/A"}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-[#4ecdc4] text-black mt-3 hover:bg-[#3bbdb4] w-max self-start cursor-pointer"
                                        onClick={e => {
                                            e.stopPropagation();
                                            navigate(`/recipes/${recipe.recipeId}`);
                                        }}
                                    >
                                        View Recipe
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </section>

        </div>
    );
};

export default ChefDetails;
