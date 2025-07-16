import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("name", res.name);

      setUser({ role: res.role, name: res.name, userId: res.userId });

      if (res.role === "Chef") navigate("/chef/dashboard");
      else if (res.role === "FoodLover") navigate("/");
      else if (res.role === "Admin") navigate("/admin");
      toast.success("Login successful!");
    } catch (err) {
      toast.error("Login failed. Please try again.");
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#171717] text-white p-4">
      <Card className="w-full max-w-sm bg-[#1e1e1e] border-none shadow-2xl">
        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col items-center gap-2">
            <Lock className="text-[#ff6b6b] w-10 h-10 mb-1" />
            <h2 className="text-2xl font-extrabold text-center text-[#ff6b6b] tracking-tight">
              Login
            </h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <p className="text-red-500 mb-2 text-sm text-center">{error}</p>
            )}
            <div>
              <label className="block mb-2 text-white text-sm">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2c2c2c] text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-sm">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2c2c2c] text-white"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4ecdc4] text-black font-semibold py-2 rounded hover:bg-[#3bbdb4c9] transition cursor-pointer"
            >
              Login
            </Button>
          </form>
          <div className="pt-4 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <span
              className="underline cursor-pointer text-[#4ecdc4] hover:text-[#ff6b6b] transition"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
