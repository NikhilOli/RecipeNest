import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const adminName = localStorage.getItem("name") || "Admin";

  return (
    <header className="bg-[#171717] p-4 text-white shadow z-10 flex justify-between items-center sticky top-0">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div className="flex items-center gap-4">
        <span>{adminName}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 hover:text-[#ff6b6b]"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </header>
  );
}
