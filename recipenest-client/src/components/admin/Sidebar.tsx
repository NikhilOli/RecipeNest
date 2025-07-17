import { NavLink } from "react-router-dom";
import {
    Users,
    BookOpen,
    BarChart2,
    Heart,
    Star,
} from "lucide-react";

const links = [
    
    { to: "/admin", label: "Dashboard", Icon: BarChart2 },
    { to: "/admin/users", label: "Users", Icon: Users },
    { to: "/admin/recipes", label: "Recipes", Icon: BookOpen },
    { to: "/admin/analytics", label: "Analytics", Icon: BarChart2 },
    { to: "/admin/likes", label: "Likes", Icon: Heart },
    { to: "/admin/ratings", label: "Ratings", Icon: Star },
    { to: "/admin/follows", label: "Follows", Icon: Users }, 
];

export default function Sidebar() {
    return (
        <nav className="flex flex-col gap-2 p-4 w-52 bg-[#1e1e1e] min-h-screen">
        {links.map(({ to, label, Icon }) => (
            <NavLink
            to={to}
            key={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded hover:bg-[#4ecdc4] hover:text-black transition ${
                isActive ? "bg-[#4ecdc4] text-black" : "text-gray-400"
                }`
            }
            >
            <Icon className="w-5 h-5" />
            <span className="font-semibold">{label}</span>
            </NavLink>
        ))}
        </nav>
    );
}
