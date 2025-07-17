import { useEffect, useState } from "react";
import API from "@/services/api";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/admin/Pagination";

interface Like {
    userId: string;
    userName: string;
    userEmail: string;
    recipeId: string;
    recipeTitle: string;
    likedAt: string;
}

export default function Likes() {
    const [likes, setLikes] = useState<Like[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchLikes();
    }, []);

    const fetchLikes = () => {
        setLoading(true);
        API.get<Like[]>("/admin/likes")
        .then((res) => {
            const mapped = res.data.map((like: any) => ({
            userId: like.User?.UserId || like.userId,
            userName: like.User?.Name || like.userName,
            userEmail: like.User?.Email || like.userEmail,
            recipeId: like.Recipe?.RecipeId || like.recipeId,
            recipeTitle: like.Recipe?.Title || like.recipeTitle,
            likedAt: like.CreatedAt || like.likedAt || like.createdAt,
            }));
            setLikes(mapped);
        })
        .catch(() => toast.error("Failed to load likes"))
        .finally(() => setLoading(false));
    };

    const filteredLikes = likes.filter(
        (like) =>
        like.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        like.recipeTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedLikes = filteredLikes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm]);

    if (loading)
        return (
        <div className="p-16 text-center text-gray-400">Loading likes...</div>
        );

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-bold text-pink-400">
            Recipe Likes Overview
        </h2>

        <Input
            placeholder="Search by user or recipe"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mb-6 bg-[#2b2b2b] text-white placeholder-gray-400 border-gray-600"
        />

        {filteredLikes.length === 0 ? (
            <p className="text-center text-gray-500">No likes found.</p>
        ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedLikes.map((like) => (
                <Card
                    key={`${like.userId}-${like.recipeId}`}
                    className="bg-[#1e1e1e] text-white border border-gray-700 shadow-md hover:shadow-pink-500/20 transition"
                >
                    <CardContent className="flex flex-col gap-3 py-4 px-5">
                    <p className="font-semibold text-lg text-pink-300">
                        {like.recipeTitle}
                    </p>
                    <div className="text-sm text-gray-300">
                        <p>
                        <span className="font-medium text-white">Liked by:</span>{" "}
                        {like.userName}
                        </p>
                        <p className="text-xs text-gray-400">{like.userEmail}</p>
                    </div>
                    <p className="text-xs text-yellow-300 mt-1">
                        Liked on:{" "}
                        {new Date(like.likedAt).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        })}
                    </p>
                    </CardContent>
                </Card>
                ))}
            </div>

            <div className="flex justify-center mt-10">
                <Pagination
                totalItems={filteredLikes.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                className="mt-4"
                />
            </div>
            </>
        )}
        </div>
    );
}
