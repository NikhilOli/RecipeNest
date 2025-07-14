import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
    Heart,
    Star,
    Users,
    BookOpen,
    Calendar,
    Mail,
    User,
} from "lucide-react";

interface ChefProfile {
    userId: string;
    name: string;
    email: string;
    bio?: string;
    recipesCount: number;
    createdAt: string;
    followers: number;
    totalLikes: number;
    avgRating: number;
}

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ChefProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

  // Editable form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        if (!user?.userId) return;

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await API.get<ChefProfile>(`/chefs/${user.userId}`);
            setProfile(res.data);
            setName(res.data.name);
            setEmail(res.data.email);
            setBio(res.data.bio || "");
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    fetchProfile();
    }, [user?.userId]);

    const handleSave = async () => {
    if (!name || !email) {
            toast.error("Name and email are required");
            return;
        }
        setSaving(true);
        try {
        await API.put(`/chefs/${user?.userId}`, {
            name,
            email,
            bio,
        });
        toast.success("Profile updated successfully");
        // Optionally refresh profile data here
        } catch {
        toast.error("Failed to update profile");
        } finally {
        setSaving(false);
        }
    };

    if (loading)
        return <div className="text-center py-24 text-gray-500">Loading profile...</div>;

    if (!profile)
        return (
        <div className="text-center py-24 text-red-500">Profile not found</div>
        );

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-[#171717]">My Profile</h1>

        {/* Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <StatCard icon={<BookOpen className="text-[#4ecdc4]" />} label="Recipes" value={profile.recipesCount} />
            <StatCard icon={<Heart className="text-[#ff6b6b]" />} label="Total Likes" value={profile.totalLikes} />
            <StatCard icon={<Users className="text-[#b39ddb]" />} label="Followers" value={profile.followers} />
            <StatCard icon={<Star className="text-[#ffe066]" />} label="Avg Rating" value={profile.avgRating.toFixed(1)} />
        </div>

        {/* Personal Info Form */}
        <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-gray-600" />
                Email
                </Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="md:col-span-2">
                <Label htmlFor="bio" className="mb-2">Bio</Label>
                <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            </div>
        </section>

        {/* Account Details */}
        <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
            <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span><strong>User ID:</strong> {profile.userId}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span><strong>Registered On:</strong> {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}</span>
            </div>
            <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span><strong>Average Rating:</strong> {profile.avgRating.toFixed(1)}</span>
            </div>
            </div>
        </section>

        <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#4ecdc4] text-black font-semibold hover:bg-[#3bbdb4] cursor-pointer"
        >
            {saving ? "Saving..." : "Save Changes"}
        </Button>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
    return (
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-6 min-w-[140px]">
        <div className="mb-2">{icon}</div>
        <div className="text-3xl font-extrabold text-[#171717]">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
        </div>
    );
}
