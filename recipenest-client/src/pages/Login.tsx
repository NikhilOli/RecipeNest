import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const res = await login(email, password);
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("userId", res.userId);

        if (res.role === "Chef") navigate("/dashboard");
        else if (res.role === "FoodLover") navigate("/chefs");
        else if (res.role === "Admin") navigate("/admin");
        toast.success("Login successful!");
        } catch (err) {
        toast.error("Login failed. Please try again.");
        setError("Invalid credentials");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#171717] text-white">
        <form
            onSubmit={handleLogin}
            className="bg-[#1e1e1e] p-8 rounded-lg shadow-md w-full max-w-sm"
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-[#ff6b6b]">
            Login
            </h2>

            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

            <label className="block mb-2 text-sm">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mb-4 rounded bg-[#2c2c2c] text-white"
            required
            />

            <label className="block mb-2 text-sm">Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-6 rounded bg-[#2c2c2c] text-white"
            required
            />

            <button
            type="submit"
            className="w-full bg-[#4ecdc4] text-black font-semibold py-2 rounded hover:bg-[#3bbdb4c9] transition cursor-pointer"
            >
            Login
            </button>
        </form>
        </div>
    );
};

export default Login;
