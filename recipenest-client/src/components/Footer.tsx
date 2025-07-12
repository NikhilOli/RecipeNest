import { ChefHat } from "lucide-react";

const Footer = () => {
  return (
  <footer className="w-full bg-[#1e1e1e] text-gray-400 py-6 mt-1">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <ChefHat className="text-[#ff6b6b] w-5 h-5" />
        <span className="font-semibold">RecipeNest</span>
      </div>
      <div className="text-sm">
        © {new Date().getFullYear()} RecipeNest. All rights reserved.
      </div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-[#ff6b6b] transition">Privacy</a>
        <a href="#" className="hover:text-[#ff6b6b] transition">Terms</a>
      </div>
    </div>
  </footer>
  );
}

export default Footer