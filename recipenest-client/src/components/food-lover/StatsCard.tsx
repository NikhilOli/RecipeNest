import type { ReactNode } from "react";

interface StatsCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
}

export default function StatsCard({ icon, label, value }: StatsCardProps) {
    return (
        <div className="flex flex-col items-center p-2 min-w-[100px] bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-default">
        <div className="mb-1">{icon}</div>
        <div className="text-lg font-semibold text-[#171717]">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}
