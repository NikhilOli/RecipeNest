import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, ChefHat, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";
import type { ChefProps } from "@/types/types";
import { Users, Star, Heart } from "lucide-react";

const ChefsList = () => {
  const [chefs, setChefs] = useState<ChefProps[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get("/chefs")
      .then(res => setChefs(res.data))
      .catch(err => console.error("Failed to fetch chefs", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredChefs = chefs.filter(chef =>
    chef.name.toLowerCase().includes(search.toLowerCase())
  );  

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 min-h-screen">
      <h2 className="text-3xl font-bold text-[#ff6b6b] mb-6 text-center">Meet Our Chefs</h2>
      <div className="mb-8 flex items-center gap-3 justify-center">
        <Search className="text-[#4ecdc4]" />
        <Input
          type="text"
          placeholder="Search chefs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs text-white"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-pulse bg-gray-800 h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredChefs.map(chef => (
            <Card
              key={chef.userId}
              className="bg-[#1e1e1e] border-none shadow-xl hover:shadow-2xl hover:scale-[1.03] transition cursor-pointer group relative"
              onClick={() => navigate(`/chefs/${chef.userId}`)}
            >
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#4ecdc4] flex items-center justify-center text-2xl font-bold text-[#171717] shadow-lg">
                  {chef.name ? chef.name.charAt(0) : <ChefHat />}
                </div>
                <span className="font-bold text-xl text-[#ff6b6b]">{chef.name}</span>
                <span className="text-gray-400 text-center min-h-[40px] italic">
                  {chef.bio || "No bio provided."}
                </span>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-[#4ecdc4]">
                    <BookOpen className="w-4 h-4" /> {chef.recipesCount ?? 0} Recipes
                  </span>
                  {chef.avgRating != undefined && (
                    <span className="flex items-center gap-1 text-[#ffe066]">
                      <Star className="w-4 h-4" /> {(chef.avgRating ?? 0).toFixed(1)}
                    </span>
                  )}
                  {chef.totalLikes != undefined && (
                    <span className="flex items-center gap-1 text-[#ff6b6b]">
                      <Heart className="w-4 h-4" /> {chef.totalLikes ?? 0}
                    </span>
                  )}
                  {chef.followers != undefined && (
                    <span className="flex items-center gap-1 text-[#b39ddb]">
                      <Users className="w-4 h-4" /> {chef.followers ?? 0}
                    </span>
                  )}
                </div>
              </CardContent>
              <span className="absolute top-4 right-4 rounded py-1 px-2 bg-gray-800 text-xs text-gray-300">
                Joined {chef.createdAt && chef.createdAt !== "0001-01-01T00:00:00"
                  ? new Date(chef.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }) : "N/A"}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default ChefsList;
