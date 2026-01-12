"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import LocationSearchBar from "./LocationSearchBar";

type Props = {
    sidebar: React.ReactNode;
    children: React.ReactNode;
};

export default function FeedLayout({ sidebar, children }: Props) {
    const [showSidebar, setShowSidebar] = useState(false); // Default hidden on mobile? Or logic based on screen?
    // Let's assume on desktop it's usually visible, but user asked for a Button to display/hide it.
    // "Filter button... displays and hides with sliding".

    // Actually, standard UX: Desktop -> Sidebar always visible? 
    // User request: "Filter button... by which the filter sidebarr displays and hides".
    // I will make it collapsible on both desktop and mobile for maximum flexibility.

    return (
        <div className="min-h-screen">
            {/* TOP HEADER */}
            <div className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-sm p-2 mb-2">
                <div className="max-w-7xl mx-auto flex items-center gap-4">

                    {/* FILTER TOGGLE BUTTON */}
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`flex items-center gap-2 border-2 border-black px-4 py-3 font-mono text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none
                    ${showSidebar ? 'bg-black text-white' : 'bg-white text-black'}
                `}
                    >
                        {showSidebar ? <X size={20} /> : <Filter size={20} />}
                        <span className="hidden sm:inline">FILTERS</span>
                    </button>

                    {/* SEARCH BAR */}
                    <div className="flex-1">
                        <LocationSearchBar />
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-2 md:p-6 relative">
                <div className="flex gap-6 relative">



                    <aside
                        className={`
                    fixed inset-y-0 left-0 z-50 w-80 bg-white border-r-2 border-black transition-transform duration-300 ease-in-out
                    md:relative md:border-none md:bg-transparent md:h-auto md:shadow-none
                    ${showSidebar ? 'translate-x-0' : '-translate-x-full md:hidden'}
                 `}
                    >
                        <div className="h-full md:h-auto overflow-y-auto md:overflow-visible no-scrollbar md:pr-4">
                            {/* Close button on Mobile only */}
                            <div className="md:hidden flex justify-end p-4">
                                <button onClick={() => setShowSidebar(false)}><X /></button>
                            </div>
                            {sidebar}
                        </div>
                    </aside>

                    {/* OVERLAY FOR MOBILE */}
                    {showSidebar && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setShowSidebar(false)}
                        />
                    )}

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
