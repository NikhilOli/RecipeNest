import type { User } from "@/types/types";


export default function TopChefsPanel({ users }: { users: User[] }) {
  const topByFollowers = [...users]
    .filter(u => u.role === "Chef")
    .sort((a, b) => (b.followersCount ?? 0) - (a.followersCount ?? 0))
    .slice(0, 5);

  const topByRecipes = [...users]
    .filter(u => u.role === "Chef")
    .sort((a, b) => (b.recipesCount ?? 0) - (a.recipesCount ?? 0))
    .slice(0, 5);

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="bg-[#1e1e1e] rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-[#4ecdc4] mb-4">Top Chefs by Followers</h3>
        <ul>
          {topByFollowers.map((chef, i) => (
            <li key={chef.userId} className="mb-1 flex justify-between items-center">
              <span className="font-medium text-white">{i + 1}. {chef.name}</span>
              <span className="text-[#ff6b6b] font-semibold text-sm">{chef.followersCount ?? 0} Followers</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[#1e1e1e] rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-[#4ecdc4] mb-4">Top Chefs by Recipes</h3>
        <ul>
          {topByRecipes.map((chef, i) => (
            <li key={chef.userId} className="mb-1 flex justify-between items-center">
              <span className="font-medium text-white">{i + 1}. {chef.name}</span>
              <span className="text-[#ff6b6b] font-semibold text-sm">{chef.recipesCount ?? 0} Recipes</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

