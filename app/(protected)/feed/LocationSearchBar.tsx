"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LocationSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("query") || "");
    // Simple local debounce logic if hook doesn't exist
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    // Sync from URL if it changes externally
    useEffect(() => {
        setQuery(searchParams.get("query") || "");
    }, [searchParams]);

    useEffect(() => {
        // Only push if debounced value is different from current URL param
        const current = searchParams.get("query") || "";
        if (debouncedQuery !== current) {
            const params = new URLSearchParams(searchParams.toString());
            if (debouncedQuery) {
                params.set("query", debouncedQuery);
            } else {
                params.delete("query");
            }
            router.push(`/feed?${params.toString()}`);
        }
    }, [debouncedQuery, router, searchParams]);

    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by location, city, or area..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-black font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50 transition-colors"
                />
            </div>
        </div>
    );
}
