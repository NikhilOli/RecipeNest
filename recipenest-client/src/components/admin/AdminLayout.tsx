import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-[#171717] text-white mt-14">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto px-6 bg-[#121212]">
            <Outlet />
            </main>
        </div>
        </div>
    );
}

