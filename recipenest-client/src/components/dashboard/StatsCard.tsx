import type{ ReactNode } from "react";

interface StatsCardProps {
    icon: ReactNode;
    value: string | number;
    label: string;
}

export default function StatsCard({ icon, value, label }: StatsCardProps) {
    return (
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-6 min-w-[140px]">
        <div className="mb-2">{icon}</div>
        <div className="text-2xl font-bold text-[#171717]">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
        </div>
    );
}
