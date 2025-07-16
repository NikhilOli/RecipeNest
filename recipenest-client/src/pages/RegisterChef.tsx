// ✅ React component: RegisterChef.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import API from "@/services/api";

const RegisterChef = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/chefs/register", form);
      toast.success("Chef registered successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#171717] text-white p-4">
      <Card className="w-full max-w-md bg-[#1e1e1e] border-none shadow-xl">
        <CardContent className="space-y-6 p-6">
          <h2 className="text-2xl font-bold text-center text-[#ff6b6b]">Register as Chef</h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <Input
              className="my-6"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />

            <Input
              className="my-6"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <Input
              className="my-6"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Short bio"
              rows={3}
              className="w-full rounded bg-[#2c2c2c] p-2 text-white border border-gray-600 focus:outline-none"
            />

            <Button type="submit" className="w-full bg-[#4ecdc4] text-black hover:bg-[#3bbdb4] cursor-pointer">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterChef;
