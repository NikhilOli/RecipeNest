import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Chefs", path: "/chefs" },
    { label: "Recipes", path: "/recipes" },
    { label: "About", path: "/about" },
  ];
  return (
    <nav className="w-full bg-[#1e1e1e] text-white shadow-md fixed top-0 left-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <ChefHat className="text-[#ff6b6b] w-7 h-7" />
          <span className="font-bold text-xl tracking-tight">RecipeNest</span>
        </div>
        <div className="hidden md:flex gap-4">
          {navLinks.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              className="text-white hover:text-[#ff6b6b]"
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </Button>
          ))}
        </div>
        <div className="hidden md:flex gap-2">
          <Button className="bg-[#4ecdc4] text-black font-semibold hover:bg-[#3bbdb4]" onClick={() => navigate("/login")}>Login</Button>
          <Button className="bg-[#ff6b6b] text-white font-semibold hover:bg-[#e55d5d]" onClick={() => navigate("/register")}>Register</Button>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Menu className="w-7 h-7 cursor-pointer" onClick={() => setMobileOpen(true)} />
        </div>
      </div>
      {/* Mobile slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-[#171717] shadow-lg z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxWidth: "320px" }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#222]">
          <span className="font-bold text-lg">Menu</span>
          <X className="w-6 h-6 cursor-pointer" onClick={() => setMobileOpen(false)} />
        </div>
        <div className="flex flex-col gap-2 px-6 py-4">
          {navLinks.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              className="justify-start text-white hover:text-[#ff6b6b]"
              onClick={() => {
                setMobileOpen(false);
                navigate(link.path);
              }}
            >
              {link.label}
            </Button>
          ))}
          <Button className="bg-[#4ecdc4] text-black font-semibold hover:bg-[#3bbdb4] mt-4" onClick={() => { setMobileOpen(false); navigate("/login"); }}>
            Login
          </Button>
          <Button className="bg-[#ff6b6b] text-white font-semibold hover:bg-[#e55d5d]" onClick={() => { setMobileOpen(false); navigate("/register"); }}>
            Register
          </Button>
        </div>
      </div>
      {/* Overlay when menu is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
