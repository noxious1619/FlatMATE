"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { LogOut, Trash2 } from "lucide-react";

type Listing = {
  id: string;
  title: string;
  price: number;
  images: string[];
  createdAt: string;
};

export default function ProfilePage() {

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch my listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings/my");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Delete listing
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Mark this listing as filled?");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });

      // Remove from UI instantly
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to delete listing", err);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 space-y-8">

        {/* 1. ID CARD SECTION */}
        <section className="bg-white border-2 border-black p-8 shadow-retro flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute top-[-20px] right-[-20px] text-9xl opacity-5 font-heavy rotate-12 pointer-events-none">
            148
          </div>

          <div className="w-24 h-24 bg-gray-200 rounded-full border-2 border-black overflow-hidden flex-shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dishant" alt="Profile" />
          </div>

          <div className="text-center md:text-left flex-grow">
            <h1 className="font-heavy text-3xl uppercase">Dishant Pandey</h1>
            <p className="font-mono text-sm text-gray-500 mb-2">CSE • Batch 2025</p>
            <div className="inline-block bg-green-100 text-green-800 border-2 border-green-600 px-3 py-1 font-mono text-xs font-bold uppercase">
              ✅ Verified Student
            </div>
          </div>

          <button className="flex items-center gap-2 font-mono font-bold text-red-600 hover:bg-red-50 px-4 py-2 border-2 border-transparent hover:border-red-200 transition-all">
            <LogOut size={18} /> LOGOUT
          </button>
        </section>

        {/* 2. MY LISTINGS SECTION */}
        <section>
          {/* ACTIVE LISTINGS */}
          <h2 className="font-heavy text-xl mb-4 border-b-2 border-black inline-block">
            MY ACTIVE LISTINGS
          </h2>

          {loading && <p className="font-mono text-gray-500">Loading listings...</p>}

          {!loading && listings.filter(l => l.isAvailable).length === 0 && (
            <p className="font-mono text-gray-500">
              You haven’t posted any active listings yet.
            </p>
          )}

          <div className="space-y-4">
            {listings
              .filter((listing) => listing.isAvailable)
              .map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border-2 border-black p-4 flex gap-4 items-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-20 h-20 bg-gray-200 border border-black flex-shrink-0">
                    <img
                      src={listing.images?.[0] || "/placeholder.png"}
                      className="w-full h-full object-cover"
                      alt={listing.title}
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-heavy text-lg leading-none">{listing.title}</h3>
                    <p className="font-mono text-xs text-gray-500 mb-2">₹{listing.price}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="text-red-600 hover:bg-red-100 p-2 border border-transparent hover:border-red-200 transition-colors"
                    title="Mark as filled"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
          </div>

          {/* INACTIVE / FILLED LISTINGS */}
          <h2 className="font-heavy text-xl mt-8 mb-4 border-b-2 border-black inline-block">
            FILLED / INACTIVE LISTINGS
          </h2>

          {!loading && listings.filter(l => !l.isAvailable).length === 0 && (
            <p className="font-mono text-gray-500">
              You haven’t posted any filled listings yet.
            </p>
          )}

          <div className="space-y-4">
            {listings
              .filter((listing) => !listing.isAvailable)
              .map((listing) => (
                <div
                  key={listing.id}
                  className="bg-gray-100 border-2 border-gray-400 p-4 flex gap-4 items-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] opacity-80"
                >
                  <div className="w-20 h-20 bg-gray-300 border border-gray-500 flex-shrink-0">
                    <img
                      src={listing.images?.[0] || "/placeholder.png"}
                      className="w-full h-full object-cover"
                      alt={listing.title}
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-heavy text-lg leading-none">{listing.title}</h3>
                    <p className="font-mono text-xs text-gray-500 mb-2">₹{listing.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>



      </div>
    </main>
  );
}