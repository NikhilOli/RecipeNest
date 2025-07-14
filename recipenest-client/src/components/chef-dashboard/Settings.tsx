import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import API from "@/services/api";
import ConfirmDialog from "../ConfirmDialog";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
    const { logout } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
        toast.error("New password and confirmation do not match");
        return;
        }
        setLoading(true);
        try {
        await API.put("/auth/change-password", { currentPassword, newPassword });
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        } catch {
        toast.error("Failed to change password");
        } finally {
        setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
        await API.delete("/auth/delete-account");
        toast.success("Account deleted");
        logout();
        } catch {
        toast.error("Failed to delete account");
        } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
        <h1 className="text-3xl font-bold text-[#171717]">Settings</h1>

        {/* Change Password */}
        <section>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4 max-w-md">
            <div>
                <Label className="mb-2" htmlFor="currentPassword">Current Password</Label>
                <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                />
            </div>
            <div>
                <Label className="mb-2" htmlFor="newPassword">New Password</Label>
                <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <div>
                <Label className="mb-2" htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <Button className="cursor-pointer" onClick={handleChangePassword} disabled={loading}>
                {loading ? "Saving..." : "Change Password"}
            </Button>
            </div>
        </section>

        {/* Delete Account */}
        <section>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
            <Button className="cursor-pointer" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            Delete My Account
            </Button>
        </section>

        {/* Logout */}
        <section>
            <Button className="cursor-pointer" variant="outline" onClick={logout}>
            Logout
            </Button>
        </section>

        <ConfirmDialog
            open={deleteDialogOpen}
            title="Delete Account"
            description="Are you sure you want to delete your account? This action cannot be undone."
            onConfirm={handleDeleteAccount}
            onCancel={() => setDeleteDialogOpen(false)}
        />
        </div>
    );
}
