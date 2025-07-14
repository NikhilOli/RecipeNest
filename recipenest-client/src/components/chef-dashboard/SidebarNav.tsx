import { Home, BookOpen, User, BarChart2, Settings } from "lucide-react";

const navItems = [
  { label: "Overview", icon: Home },
  { label: "My Recipes", icon: BookOpen },
  { label: "Profile", icon: User },
  { label: "Analytics", icon: BarChart2 },
  { label: "Settings", icon: Settings },
];

export default function SidebarNav({ active, onSelect }: { active: string; onSelect: (menu: string) => void }) {
  return (
    <aside className="bg-[#171717] text-white min-h-screen w-60 flex flex-col py-8 px-4 fixed">
      <h2 className="text-2xl font-extrabold text-[#4ecdc4] mb-10 pl-2">Chef Dashboard</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition cursor-pointer ${
              active === label ? "bg-[#4ecdc4] text-[#171717]" : "hover:bg-[#222]"
            }`}
          >
            <Icon className={`w-6 h-6 ${active === label ? "text-[#171717]" : "text-[#4ecdc4]"}`} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
