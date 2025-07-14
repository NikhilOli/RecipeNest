import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, UserCircle, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout(); // calls context logout which clears localStorage and resets user
    navigate("/");
  };

  // Define menu items based on role
  const guestLinks = [
    { label: "Chefs", path: "/chefs" },
    { label: "Recipes", path: "/recipes" },
  ];

  const chefLinks = [
    { label: "Dashboard", path: "/chef/dashboard" },
    { label: "My Recipes", path: "/chef/recipes" },
  ];

  const foodLoverLinks = [
    { label: "Chefs", path: "/chefs" },
    { label: "Recipes", path: "/recipes" },
  ];

  const commonLoggedInLinks = [
    { label: "Profile", path: "/profile" },
  ];

  // Build links based on user role
  let links = guestLinks;
  if (user?.role === "Chef") {
    links = [...chefLinks, ...commonLoggedInLinks];
  } else if (user?.role === "FoodLover") {
    links = [...foodLoverLinks, ...commonLoggedInLinks];
  } else if (user?.role === "Admin") {
    links = [{ label: "Admin Panel", path: "/admin" }, ...commonLoggedInLinks];
  }
  

  return (
    <nav className="w-full bg-[#1e1e1e] text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <ChefHat className="text-[#ff6b6b] w-7 h-7" />
          <span className="font-bold text-xl tracking-tight">RecipeNest</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map(link => (
            <Button
              key={link.label}
              variant="ghost"
              className="text-white hover:text-[#ff6b6b]"
              onClick={() => {
                setMobileOpen(false);
                navigate(link.path);
              }}
            >
              {link.label}
            </Button>
          ))}

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#4ecdc4] text-[#171717] font-semibold cursor-default select-none">
                <UserCircle className="w-5 h-5" />
                <span>{user.name || user.role}</span>
              </div>
              <Button
                variant="ghost"
                className="text-[#ff6b6b]"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-[#4ecdc4] text-black font-semibold hover:bg-[#3bbdb4]"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-[#ff6b6b] text-white font-semibold hover:bg-[#e55d5d]"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Menu
            className="w-7 h-7 cursor-pointer"
            onClick={() => setMobileOpen(true)}
          />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-[#171717] shadow-lg z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#222]">
          <span className="font-bold text-lg">Menu</span>
          <X
            className="w-6 h-6 cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-3 px-6 py-4">
          {links.map(link => (
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

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#4ecdc4] text-[#171717] font-semibold cursor-default select-none mt-4">
                <UserCircle className="w-5 h-5" />
                <span>{user.name || user.role}</span>
              </div>
              <Button
                variant="ghost"
                className="text-[#ff6b6b]"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-[#4ecdc4] text-black font-semibold hover:bg-[#3bbdb4] mt-4"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Button
                className="bg-[#ff6b6b] text-white font-semibold hover:bg-[#e55d5d]"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/register");
                }}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
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
