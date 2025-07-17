import { useEffect, useState } from "react";
import API from "@/services/api";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/admin/Pagination";

interface Follow {
    followerId: string;
    followerName: string;
    followerEmail: string;
    followingId: string;
    followingName: string;
    followingEmail: string;
    followedAt: string;
}

export default function Follows() {
    const [follows, setFollows] = useState<Follow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchFollows();
    }, []);

    const fetchFollows = () => {
        setLoading(true);
        API.get<Follow[]>("/admin/follows")
        .then((res) => setFollows(res.data))
        .catch(() => toast.error("Failed to load follows"))
        .finally(() => setLoading(false));
    };

  // Filter by follower or following name or email
    const filteredFollows = follows.filter(
        (f) =>
        f.followerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.followerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.followingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.followingEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination slice
  const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentFollows = filteredFollows.slice(indexOfFirst, indexOfLast);

    if (loading) return <div className="text-center p-16 text-gray-400">Loading follows...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-bold text-[#ff6b6b]">Follows Management</h2>

        <Input
            placeholder="Search by follower or following name/email"
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            }}
            className="max-w-md mb-6"
        />

        {filteredFollows.length === 0 ? (
            <p className="text-center text-gray-500">No follow relationships found.</p>
        ) : (
            <>
            <div className="space-y-6">
                {currentFollows.map((f) => (
                <Card key={f.followerId + "-" + f.followingId} className="bg-[#1e1e1e] border border-gray-700 shadow">
                    <CardContent className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-lg truncate">Follower: {f.followerName}</p>
                        <p className="text-gray-400 text-sm truncate">{f.followerEmail}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[#4ecdc4] font-semibold text-lg truncate">Following: {f.followingName}</p>
                        <p className="text-gray-400 text-sm truncate">{f.followingEmail}</p>
                    </div>
                    <div className="flex-1 min-w-0 text-gray-500 text-sm self-center">
                        Followed At:
                        <br />
                        {new Date(f.followedAt).toLocaleString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>

            {filteredFollows.length > itemsPerPage && (
                <Pagination
                totalItems={filteredFollows.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                className="mt-8"
                />
            )}
            </>
        )}
        </div>
    );
}
