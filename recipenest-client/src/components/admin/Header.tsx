import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const adminName = localStorage.getItem("name") || "Admin";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Get initials from name for avatar fallback
  const initials = adminName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="bg-[#171717] p-4 shadow z-20 sticky top-0 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white select-none">Admin Panel</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          onClick={() => setDropdownOpen(state => !state)}
          className="flex items-center gap-2 bg-[#2a2a2a] rounded-md px-3 py-1 hover:bg-[#3b3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] text-white select-none cursor-pointer"
        >
          {/* Avatar circle with initials */}
          <div className="rounded-full bg-[#ff6b6b] w-8 h-8 flex items-center justify-center font-semibold text-white">
            {initials}
          </div>
          <span className="font-medium truncate max-w-[150px]">{adminName}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-[#252525] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-30">
            {/* Example future expansion: <a href="/admin/profile" ...>Profile</a> */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-[#ff6b6b] hover:bg-[#3b3b3b] flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
