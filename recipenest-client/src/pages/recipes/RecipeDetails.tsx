import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Heart, Star } from "lucide-react";
import API from "@/services/api";
import type { RecipeDetailProps } from "@/types/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

interface RatingInfo {
    ratingId: string;
    userId: string;
    name: string;
    stars: number;
    comment?: string;
}

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [recipe, setRecipe] = useState<RecipeDetailProps | null>(null);
    const [hasLiked, setHasLiked] = useState(false);
    const [ratingStars, setRatingStars] = useState(0);
    const [ratingComment, setRatingComment] = useState("");
    const [submittingRating, setSubmittingRating] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [ratings, setRatings] = useState<RatingInfo[]>([]);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        if (!id) return;

        API.get(`/recipes/${id}`).then(res => setRecipe(res.data));

        if (user?.userId) {
            API.get(`/recipeactions/likes/${id}`).then(res => {
                const liked = res.data.some((u: any) => u.userId === user.userId);
                setHasLiked(liked);
            });

            API.get(`/recipeactions/ratings/${id}`).then(res => {
                setRatings(res.data);
                const myRating = res.data.find((r: RatingInfo) => r.userId === user.userId);
                if (myRating) {
                    setHasRated(true);
                }
            });
        }
    }, [id, user]);

    const handleLike = async () => {
    if (!user) return toast.error("Login required to like");
    try {
      if (hasLiked) {
        await API.delete(`/recipeactions/unlike`, {
          params: { userId: user.userId, recipeId: id },
        });
        toast.success("Unliked");
        setHasLiked(false);
      } else {
        await API.post(`/recipeactions/like`, null, {
          params: { userId: user.userId, recipeId: id },
        });
        toast.success("Liked");
        setHasLiked(true);
      }
    } catch {
      toast.error("Action failed");
    }
  };

    const handleRate = async () => {
        if (!user) return toast.error("Login required to rate");
        if (!ratingStars) return toast.error("Please select a rating");
        setSubmittingRating(true);
        try {
            await API.post(`/recipeactions/rate`, null, {
                params: {
                    userId: user.userId,
                    recipeId: id,
                    stars: ratingStars,
                    comment: ratingComment
                }
            });
            toast.success("Rated successfully");
            setRatingStars(0);
            setRatingComment("");
            setShowRating(false);
            setHasRated(true);
            API.get(`/recipeactions/ratings/${id}`).then(res => setRatings(res.data));
        } catch {
            toast.error("Rating failed");
        } finally {
            setSubmittingRating(false);
        }
    };

    if (!recipe) return <div className="text-center py-24">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
            <Card className="bg-[#1e1e1e] border-none shadow-xl">
                <CardContent className="p-8">
                    <img
                        src={`https://localhost:7288/${recipe.imageUrl}` || "/default-recipe.jpg"}
                        alt={recipe.title}
                        className="w-full max-h-64 object-cover rounded-lg mb-6"
                    />
                    <h2 className="text-3xl font-bold text-[#ff6b6b] mb-2">{recipe.title}</h2>
                    <div className="flex items-center gap-3 mb-4">
                        <ChefHat className="text-[#4ecdc4]" />
                        <span
                            className="font-semibold text-gray-300 cursor-pointer hover:text-[#ff6b6b]"
                            onClick={() => navigate(`/chefs/${recipe.userId}`)}
                        >
                            {recipe.chefName}
                        </span>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-bold text-lg mb-1 text-white">Ingredients</h3>
                        <ul className="list-disc pl-6 text-gray-300">
                            {recipe.ingredients.split("\n").map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-bold text-lg mb-1 text-white">Instructions</h3>
                        <p className="text-gray-300 whitespace-pre-line">{recipe.instructions}</p>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold cursor-pointer ${hasLiked ? "bg-gray-600 text-white" : "bg-[#4ecdc4] text-black hover:bg-[#3bbdb4]"}`}
                        >
                            <Heart /> {hasLiked ? "Liked" : "Like"}
                        </button>

                        {!hasRated && (
                            <button
                                onClick={() => setShowRating(!showRating)}
                                className="flex items-center gap-2 px-4 py-2 rounded font-semibold cursor-pointer bg-[#ff6b6b] text-white hover:bg-[#e55d5d]"
                            >
                                <Star /> Rate
                            </button>
                        )}
                        {hasRated && <div className="text-green-400 font-semibold mt-2">You already rated</div>}
                    </div>

                    {showRating && (
                        <div className="mt-4 bg-gray-900 p-4 rounded-xl space-y-3">
                            <div className="flex gap-1 items-center">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={`w-6 h-6 cursor-pointer ${star <= ratingStars ? "text-yellow-400" : "text-gray-400"}`}
                                        onClick={() => setRatingStars(star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                placeholder="Leave a comment (optional)"
                                className="w-full mt-2 p-2 rounded bg-gray-800 text-white"
                                rows={2}
                                value={ratingComment}
                                onChange={e => setRatingComment(e.target.value)}
                            ></textarea>
                            <button
                                onClick={handleRate}
                                className="mt-1 px-4 py-2 rounded bg-[#ff6b6b] text-white hover:bg-[#e55d5d]"
                                disabled={submittingRating}
                            >
                                {submittingRating ? "Submitting..." : "Submit Rating"}
                            </button>
                        </div>
                    )}

                    {ratings.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-bold text-lg mb-3 text-white">User Ratings & Comments</h3>
                            <div className="space-y-4">
                                {ratings.map((r, idx) => (
                                    <div key={idx} className="bg-gray-800 p-4 rounded-lg text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">{r.name}</span>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} className={`w-4 h-4 ${star <= r.stars ? "text-yellow-400" : "text-gray-500"}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {r.comment && <p className="text-sm text-gray-300">{r.comment}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecipeDetails;
