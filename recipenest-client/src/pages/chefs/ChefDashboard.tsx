import { useEffect, useState } from "react";
import SidebarNav from "@/components/dashboard/SidebarNav";
import Overview from "@/components/dashboard/Overview";
import MyRecipes from "@/components/dashboard/MyRecipes";
import Profile from "@/components/dashboard/Profile";
import Analytics from "@/components/dashboard/Analytics";
import Settings from "@/components/dashboard/Settings";
import API from "@/services/api";

export default function ChefDashboard() {
    const [activeMenu, setActiveMenu] = useState("Overview");
    const [chefName, setChefName] = useState("Chef");

    useEffect(() => {
        // Fetch chef profile info to get name
        API.get("/chef/profile").then(res => {
            setChefName(res.data.name || "Chef");
        });
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
        <main className="flex-1 p-8 pt-16 ml-60 overflow-auto">{renderContent()}</main>
        </div>
    );
}
