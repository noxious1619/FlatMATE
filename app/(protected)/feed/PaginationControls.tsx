"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    currentPage: number;
    totalPages: number;
};

export default function PaginationControls({ currentPage, totalPages }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`/feed?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-10 mb-20">
            <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-3 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all active:translate-y-1 active:shadow-none"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="font-mono font-bold text-lg">
                PAGE {currentPage} OF {totalPages}
            </div>

            <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-3 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all active:translate-y-1 active:shadow-none"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
