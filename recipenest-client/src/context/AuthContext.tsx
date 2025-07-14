import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    user: { role?: string; name?: string; userId?: string } | null;
    setUser: React.Dispatch<React.SetStateAction<AuthContextType["user"]>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthContextType["user"]>(null);

    useEffect(() => {
        // On mount, load user from localStorage
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role") ?? undefined;
        const name = localStorage.getItem("name") ?? undefined;
        const userId = localStorage.getItem("userId") ?? undefined;
        if (token && role) {
            setUser({ role, name, userId });
            }
    }, []);

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
