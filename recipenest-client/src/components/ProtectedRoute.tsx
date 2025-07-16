import { Navigate } from "react-router-dom";
import React from "react";
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role || !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
