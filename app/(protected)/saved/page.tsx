import Navbar from "@/app/components/Navbar";
import ListingCard from "@/app/components/ListingCard";
import { BookmarkX } from "lucide-react";

// MOCK DATA (In real app, fetch from user.savedIds)
const SAVED_LISTINGS = [
  {
    id: "2",
    rent: "8,000",
    location: "Sector 24 (Near McD)",
    gender: "Female" as const,
    tags: ["Attached Washroom", "Cooler", "Maid"],
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500&q=60"
  }
];

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="font-heavy text-3xl mb-6 flex items-center gap-2">
          <span className="bg-brand-yellow px-2 border-2 border-black">SAVED</span>
          ROOMS
        </h1>

        {SAVED_LISTINGS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SAVED_LISTINGS.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <BookmarkX size={48} className="mx-auto mb-2" />
            <p className="font-mono font-bold">No saved listings yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}