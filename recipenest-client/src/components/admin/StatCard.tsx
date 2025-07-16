import type { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: number | string;
}

export default function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-3xl font-bold text-[#171717]">{value}</div>
        <div className="text-gray-600 text-sm uppercase tracking-wider">{label}</div>
        </div>
    );
}
