import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiChefHatDuotone } from "react-icons/pi"; 
import { FaHeart } from "react-icons/fa6"; 

const RegisterRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#171717] text-white p-4">
      <Card className="w-full max-w-md bg-[#1e1e1e] border-none shadow-2xl">
        <CardContent className="space-y-8 p-8">
          <h2 className="text-2xl font-extrabold text-center text-[#ff6b6b] tracking-tight">
            Choose Your Role
          </h2>
          <div className="flex flex-col gap-6">
            <Button
              onClick={() => navigate("/register-chef")}
              className="flex items-center gap-3 w-full py-4 rounded-lg bg-gradient-to-r from-[#ff6b6b] to-[#ffb88c] text-black font-semibold text-lg shadow-lg hover:scale-[1.03] hover:from-[#ff6b6b] hover:to-[#4ecdc4] transition-all duration-200 cursor-pointer"
            >
              <PiChefHatDuotone className="text-xl" />
              Register as Chef
            </Button>
            <Button
              onClick={() => navigate("/register-foodlover")}
              className="flex items-center gap-3 w-full py-4 rounded-lg bg-gradient-to-r from-[#4ecdc4] to-[#b2fff6] text-[#171717] font-semibold text-lg shadow-lg hover:scale-[1.03] hover:from-[#4ecdc4] hover:to-[#ff6b6b] transition-all duration-200 cursor-pointer"
            >
              <FaHeart className="text-xl" />
              Register as Food Lover
            </Button>
          </div>
          <div className="pt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-[#4ecdc4] hover:text-[#ff6b6b] transition"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterRole;
