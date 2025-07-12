import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Heart, Users, Star, Utensils } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-white">

      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-16 gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Discover & Share <span className="text-[#ff6b6b]">Amazing Recipes</span> <br />
            <span className="text-[#4ecdc4]">Connect with Chefs</span> Worldwide
          </h1>
          <p className="mb-8 text-lg text-gray-300 max-w-xl">
            RecipeNest is your home for culinary inspiration. Join as a Chef to share your creations, or as a Food Lover to explore, follow, and rate the best recipes from top chefs!
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button className="bg-[#ff6b6b] text-white font-semibold px-6 py-3 text-lg hover:bg-[#e55d5d] cursor-pointer" onClick={() => navigate("/register")}>
              Get Started
            </Button>
            <Button variant="outline" className="border-[#4ecdc4] text-[#4ecdc4] font-semibold px-6 py-3 text-lg hover:bg-[#4ecdc4] hover:text-[#171717] cursor-pointer" onClick={() => navigate("/chefs")}>
              Explore Chefs
            </Button>
          </div>
        </div>
        {/* Illustration/Feature highlights */}
        <div className="flex-1 flex flex-col items-center gap-6">
          <div className="bg-[#1e1e1e] rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4">
            <Utensils className="w-12 h-12 text-[#4ecdc4]" />
            <span className="font-bold text-xl">1000+ Recipes</span>
            <span className="text-gray-400 text-sm text-center">Browse a growing collection of chef-curated recipes.</span>
          </div>
          <div className="flex gap-6">
            <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-4 flex flex-col items-center gap-2">
              <Users className="w-7 h-7 text-[#ff6b6b]" />
              <span className="font-semibold">Community</span>
            </div>
            <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-4 flex flex-col items-center gap-2">
              <Heart className="w-7 h-7 text-[#4ecdc4]" />
              <span className="font-semibold">Like & Follow</span>
            </div>
            <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-4 flex flex-col items-center gap-2">
              <Star className="w-7 h-7 text-[#ff6b6b]" />
              <span className="font-semibold">Rate Recipes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#1e1e1e] py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <ChefHat className="w-10 h-10 text-[#ff6b6b]" />
            <h3 className="font-bold text-xl">For Chefs</h3>
            <p className="text-gray-400">Create a profile, build your recipe portfolio, and connect with food lovers.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Heart className="w-10 h-10 text-[#4ecdc4]" />
            <h3 className="font-bold text-xl">For Food Lovers</h3>
            <p className="text-gray-400">Follow your favorite chefs, like and rate recipes, and discover new culinary ideas.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Star className="w-10 h-10 text-[#ff6b6b]" />
            <h3 className="font-bold text-xl">Interactive & Social</h3>
            <p className="text-gray-400">Engage with the community, leave reviews, and share your favorites.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;