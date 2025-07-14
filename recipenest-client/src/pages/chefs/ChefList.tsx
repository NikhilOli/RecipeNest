import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChefHat, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";
export interface ChefProps {
    userId: string;
    name: string;
    bio: string;
    email?: string;
    recipesCount?: number;
    createdAt?: string;
}

const ChefsList = () => {
  const [chefs, setChefs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  API.get("/chefs")
    .then(res => {
      console.log("API response", res.data); // 👈 add this
      setChefs(res.data); // might need to change this!
    })
    .catch(err => {
      console.error("Failed to fetch chefs", err);
    });
}, []);

  const filteredChefs = chefs.filter((chef: ChefProps) =>
    chef.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 min-h-screen">
      <h2 className="text-3xl font-bold text-[#ff6b6b] mb-6">Meet Our Chefs</h2>
      <div className="mb-6 flex items-center gap-3">
        <Search className="text-[#4ecdc4]" />
        <Input
          type="text"
          placeholder="Search chefs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredChefs.map((chef: ChefProps) => (
          <Card
            key={chef.userId}
            className="bg-[#1e1e1e] border-none shadow-lg hover:scale-[1.02] transition"
            onClick={() => navigate(`/chefs/${chef.userId}`)}
          >
            <CardContent className="p-6 flex flex-col items-center gap-3 cursor-pointer">
              <ChefHat className="w-10 h-10 text-[#ff6b6b]" />
              <span className="font-bold text-lg">{chef.name}</span>
              <span className="text-gray-400 text-center">{chef.bio}</span>
              <span className="text-[#4ecdc4] font-semibold">
                {chef.recipesCount || 0} Recipes
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChefsList;
