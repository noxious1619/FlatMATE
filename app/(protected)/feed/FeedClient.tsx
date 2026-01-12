"use client";

import { useState } from "react";
import ListingCard from "../components/ListingCard";
import { Map, List } from "lucide-react";
import dynamic from "next/dynamic";

const FeedMap = dynamic(() => import("../components/FeedMap"), { ssr: false });

type Props = {
    listings: any[];
};

export default function FeedClient({ listings }: Props) {
    const [viewMode, setViewMode] = useState<"LIST" | "MAP">("LIST");

    return (
        <div className="relative">

            {/* MOBILE TOGGLE BUTTON */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => setViewMode(viewMode === "LIST" ? "MAP" : "LIST")}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] border-2 border-white"
                >
                    {viewMode === "LIST" ? (
                        <>
                            <Map size={18} /> Show Map
                        </>
                    ) : (
                        <>
                            <List size={18} /> Show List
                        </>
                    )}
                </button>
            </div>

            <div className="grid md:grid-cols-5 gap-6">

                {/* LISTINGS COLUMN */}
                <div className={`md:col-span-3 ${viewMode === "MAP" ? "hidden md:block" : "block"}`}>
                    {listings.length === 0 ? (
                        <div className="text-center py-20 font-mono opacity-50">No listings found...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                            {listings.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    title={listing.title}
                                    id={listing.id}
                                    rent={listing.price.toLocaleString("en-IN")}
                                    location={listing.location?.displayAddress || listing.address || "Unknown"}
                                    category={listing.category}
                                    tags={[]}
                                    imageUrl={listing.images[0] || "fallback_url"}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* MAP COLUMN */}
                <div className={`md:col-span-2 ${viewMode === "LIST" ? "hidden md:block" : "block h-[80vh]"}`}>
                    <FeedMap listings={listings} />
                </div>

            </div>
        </div>
    );
}
