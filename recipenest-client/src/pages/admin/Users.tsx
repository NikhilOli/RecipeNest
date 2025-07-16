import { useEffect, useState } from "react";
import API from "@/services/api";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface User {
  userId: string;
  name: string;
  email: string;
  role: "Chef" | "FoodLover" | string;
  bio?: string;
  createdAt: string;
  followersCount?: number;      // For Chef
  recipesCount?: number;        // For Chef
  avgRating?: number;           // For Chef
  likedRecipesCount?: number;   // For FoodLover
  commentsCount?: number;       // For FoodLover
  followedChefsCount?: number;  // For FoodLover
  lastLogin?: string;
}


export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();
const {user} = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    API.get<User[]>("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center p-16 text-gray-400">Loading...</div>;
  if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h2 className="text-4xl font-extrabold text-[#ff6b6b] tracking-tight">Users</h2>

      <input
        type="text"
        placeholder="Search users by name, email or role"
        className="p-3 w-full max-w-md rounded border border-gray-700 bg-[#1e1e1e] text-white placeholder-gray-500 mb-8 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-6">
          {filteredUsers.map((user) => (
            <Card key={user.userId} className="bg-[#121212] border border-gray-700 shadow-md transition hover:shadow-lg cursor-pointer" onClick={() => navigate(`/admin/users/${user.userId}`)}>
              <CardContent className="flex flex-col sm:flex-row justify-between gap-y-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-semibold text-xl text-white truncate">{user.name}</h3>
                  <p className="text-gray-300 text-md truncate">{user.email}</p>
                  <p className="italic text-xs text-gray-200 capitalize mt-1">
                    Role: <span className="font-semibold text-[#ff6b6b]">{user.role}</span>
                  </p>
                  {user.bio && (
                    <p className="text-gray-300 text-sm mt-2 line-clamp-3">{user.bio}</p>
                  )}
                  <p className="text-gray-300 text-xs mt-2">
                    Joined: {new Date(user.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}
                  </p>
                  {user.lastLogin && (
                    <p className="text-gray-500 text-xs">
                      Last login: {new Date(user.lastLogin).toLocaleString()}
                    </p>
                  )}

                  {user.role === "Chef" && (
                    <div className="flex flex-wrap gap-6 mt-4 text-sm text-[#4ecdc4]">
                      <div>
                        <span className="font-semibold">{user.recipesCount ?? 0}</span> Recipes
                      </div>
                      <div>
                        <span className="font-semibold">{user.followersCount ?? 0}</span> Followers
                      </div>
                      <div>
                        Avg Rating:{" "}
                        <span className="font-semibold">
                          {user.avgRating !== undefined ? user.avgRating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                    </div>
                  )}

                  {user.role === "FoodLover" && (
                    <div className="flex flex-wrap gap-6 mt-4 text-sm text-[#ff6b6b]">
                      <div>
                        <span className="font-semibold">{user.likedRecipesCount ?? 0}</span> Liked Recipes
                      </div>
                      <div>
                        <span className="font-semibold">{user.commentsCount ?? 0}</span> Comments
                      </div>
                      <div>
                        <span className="font-semibold">{user.followedChefsCount ?? 0}</span> Chefs Followed
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
                  <Button
                    variant="outline"
                    className="whitespace-nowrap cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/users/${user.userId}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    className="whitespace-nowrap cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                      setConfirmOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete User"
        description={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          if (!selectedUser) return;
          API.delete(`/admin/users/${selectedUser.userId}`)
            .then(() => {
              toast.success("User deleted");
              setUsers(users.filter((u) => u.userId !== selectedUser.userId));
            })
            .catch(() => toast.error("Failed to delete user"))
            .finally(() => {
              setConfirmOpen(false);
              setSelectedUser(null);
            });
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
