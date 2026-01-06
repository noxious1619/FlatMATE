import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import prisma  from "@/app/lib/prisma"; // Ensure this path matches your project structure

// 1. FORCE DYNAMIC: Ensures the page rebuilds on every refresh to show new listings
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  // 2. FETCH DATA FROM DB
  const rawListings = await prisma.listing.findMany({
    orderBy: {
      createdAt: 'desc', // Newest first
    },
  });

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      {/* 3. FILTER BAR (Sticky Header) */}
      <div className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-sm border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto no-scrollbar">
          {/* Filter Button */}
          <button className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none whitespace-nowrap">
            <Filter size={16} /> FILTERS
          </button>
          
          {/* Quick Filters */}
          <button className="bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors whitespace-nowrap">
            Boys
          </button>
          <button className="bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors whitespace-nowrap">
            Girls
          </button>
          <button className="bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors whitespace-nowrap">
            AC Only
          </button>
        </div>
      </div>

      {/* 4. THE GRID */}
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {rawListings.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 opacity-50 font-mono gap-4">
            <p className="text-xl">No listings found yet...</p>
            <Link href="/create" className="text-brand-orange underline">
              Be the first to post!
            </Link>
          </div>
        ) : (
          // Grid State
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rawListings.map((listing) => {
              
              // --- DATA TRANSFORMATION ---
              // 1. Convert Boolean DB fields to UI Tags Array
              const tags: string[] = [];
              if (listing.tag_ac) tags.push("AC");
              if (listing.tag_cooler) tags.push("Cooler");
              if (listing.tag_wifi) tags.push("Wifi");
              if (listing.tag_noBrokerage) tags.push("No Broker");
              if (listing.tag_cook) tags.push("Cook");
              if (listing.tag_maid) tags.push("Maid");
              if (listing.tag_geyser) tags.push("Geyser");
              if (listing.tag_metroNear) tags.push("Near Metro");
              if (listing.tag_noRestrictions) tags.push("No Rules");

              // 2. Handle missing Image
              // Uses the first uploaded image, or a fallback placeholder
              const displayImage = listing.images.length > 0 
                ? listing.images[0] 
                : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=60";

              return (
                <ListingCard 
                  key={listing.id} 
                  id={listing.id}
                  
                  // Convert DB Int (e.g. 6500) to String "6,500"
                  rent={listing.price.toLocaleString("en-IN")} 
                  
                  // DB Schema uses 'title', UI uses 'location'. Mapping title -> location for now.
                  location={listing.title} 
                  
                  // DB Schema doesn't have 'gender' yet. Defaulting to 'Any'.
                  gender="Any" 
                  
                  tags={tags}
                  imageUrl={displayImage}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 5. FLOATING ACTION BUTTON (Post Room) */}
      <Link href="/create" className="fixed bottom-8 right-8 z-50">
        <button className="bg-brand-orange text-white border-2 border-black w-16 h-16 rounded-full flex items-center justify-center shadow-retro hover:shadow-retro-hover active:shadow-retro-active hover:-translate-y-1 transition-all group">
            <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </Link>

    </main>
  );
}