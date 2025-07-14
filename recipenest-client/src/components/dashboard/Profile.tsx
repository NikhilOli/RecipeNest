import { useEffect, useState } from "react";
import API from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/types/types";

    export default function Profile() {
    const [profile, setProfile] = useState<ProfileData>({ name: "", email: "", bio: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get("/chef/profile").then(res => setProfile(res.data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setLoading(true);
        API.put("/chef/profile", profile)
        .then(() => alert("Profile updated"))
        .finally(() => setLoading(false));
    };

    return (
        <div>
        <h1 className="text-3xl font-bold mb-8 text-[#171717]">Profile</h1>
        <Card className="bg-white p-6 max-w-lg">
            <CardContent className="flex flex-col gap-4">
            <label className="font-semibold text-gray-700">Name</label>
            <Input name="name" value={profile.name} onChange={handleChange} />

            <label className="font-semibold text-gray-700">Email</label>
            <Input name="email" value={profile.email} onChange={handleChange} disabled />

            <label className="font-semibold text-gray-700">Bio</label>
            <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="rounded border border-gray-300 p-2"
            />

            <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
            </Button>
            </CardContent>
        </Card>
        </div>
    );
}
