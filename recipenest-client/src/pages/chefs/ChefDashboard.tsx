import { useEffect, useState } from "react";
import SidebarNav from "@/components/chef-dashboard/SidebarNav";
import Overview from "@/components/chef-dashboard/Overview";
import MyRecipes from "@/components/chef-dashboard/MyRecipes";
import Profile from "@/components/chef-dashboard/Profile";
import Analytics from "@/components/chef-dashboard/Analytics";
import Settings from "@/components/chef-dashboard/Settings";

export default function ChefDashboard() {
    const [activeMenu, setActiveMenu] = useState("Overview");
    const [chefName, setChefName] = useState("Chef");

    useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
        setChefName(storedName);
    }
    }, []);

    const renderContent = () => {
        switch (activeMenu) {
        case "Overview":
            return <Overview  chefName={chefName}/>;
        case "My Recipes":
            return <MyRecipes />;
        case "Profile":
            return <Profile />;
        case "Analytics":
            return <Analytics />;
        case "Settings":
            return <Settings />;
        default:
            return <Overview chefName={chefName} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f7f7f7]">
        <SidebarNav active={activeMenu} onSelect={setActiveMenu} />
        <main className="flex-1 p-8 pt-16 overflow-auto">{renderContent()}</main>
        </div>
    );
}
