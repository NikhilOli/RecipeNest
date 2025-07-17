import React from "react";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    className?: string;
    maxPageButtons?: number;  // optional max page buttons to show, default 7
}

const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    className = "",
    maxPageButtons = 7,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const half = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const handleClick = (page: number) => {
        if (page !== currentPage) {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <nav
        className={`inline-flex items-center justify-center space-x-1 text-sm select-none ${className}`}
        aria-label="Pagination Navigation"
        >
        <button
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
            currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "hover:bg-[#ff6b6b]/20"
            }`}
            aria-label="Previous Page"
        >
            &laquo;
        </button>

        {startPage > 1 && (
            <>
            <button
                onClick={() => handleClick(1)}
                className="px-3 py-1 rounded-md hover:bg-[#ff6b6b]/20"
            >
                1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
            </>
        )}

        {pages.map((page) => (
            <button
            key={page}
            onClick={() => handleClick(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`px-3 py-1 rounded-md ${
                page === currentPage
                ? "bg-[#ff6b6b] text-white font-semibold cursor-default"
                : "hover:bg-[#ff6b6b]/20"
            }`}
            >
            {page}
            </button>
        ))}

        {endPage < totalPages && (
            <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
                onClick={() => handleClick(totalPages)}
                className="px-3 py-1 rounded-md hover:bg-[#ff6b6b]/20"
            >
                {totalPages}
            </button>
            </>
        )}

        <button
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
            currentPage === totalPages ? "text-gray-600 cursor-not-allowed" : "hover:bg-[#ff6b6b]/20"
            }`}
            aria-label="Next Page"
        >
            &raquo;
        </button>
        </nav>
    );
};

export default Pagination;
