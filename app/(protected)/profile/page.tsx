"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";


type Listing = {
  id: string;
  title: string;
  price: number;
  images: string[];
  createdAt: string;
  isAvailable: boolean;
};

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  college: string | null;
  isVerified?: boolean;
  phoneNumber?: string;
  // mapped from emailVerified in some logic, or just use boolean logic
  // we will interpret emailVerified or isVerified from backend
  // For now, let's assume valid user is verified if they have isVerified flag from API or we check emailVerified
  emailVerified: string | null;
};

export default function ProfilePage() {

  const [listings, setListings] = useState<Listing[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch my profile and listings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Profile
        const userRes = await fetch("/api/user/me");
        const userData = await userRes.json();

        if (!userRes.ok) {
          toast.error(userData.error || "Failed to fetch user profile");
        } else {
          setUser(userData);
        }

        // Fetch Listings
        const listingsRes = await fetch("/api/listings/my");
        const listingsData = await listingsRes.json();

        if (!listingsRes.ok) {
          toast.error(listingsData.error || "Failed to fetch listings");
        } else {
          setListings(listingsData);
        }

      } catch (err) {
        console.error("Failed to fetch profile data", err);
        toast.error("Network error while fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete listing
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Mark this listing as filled? (This will hide it from the feed)");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete listing");
        return;
      }

      // Success
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success(data.message || "Listing marked as filled");

    } catch (err) {
      console.error("Failed to delete listing", err);
      toast.error("Network error while deleting listing");
    }
  };


  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg pb-20 flex items-center justify-center">
        <div className="font-heavy text-xl animate-pulse">LOADING PROFILE...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 space-y-8">

        {/* 1. ID CARD SECTION */}
        <section className="bg-white border-2 border-black p-8 shadow-retro flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute top-[-20px] right-[-20px] text-9xl opacity-5 font-heavy rotate-12 pointer-events-none">
            {listings.length}
          </div>

          <div className="w-24 h-24 bg-gray-200 rounded-full border-2 border-black overflow-hidden flex-shrink-0">
            <img src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt="Profile" />
          </div>

          <div className="text-center md:text-left flex-grow">
            <h1 className="font-heavy text-3xl uppercase">{user?.name || "Anonymous User"}</h1>
            <p className="font-mono text-sm text-gray-500 mb-2">{user?.college || "College Not Set"} • {user?.email}</p>

            {user?.emailVerified ? (
              <div className="inline-block bg-green-100 text-green-800 border-2 border-green-600 px-3 py-1 font-mono text-xs font-bold uppercase">
                ✅ Verified Student
              </div>
            ) : (
              <div className="inline-block bg-yellow-100 text-yellow-800 border-2 border-yellow-600 px-3 py-1 font-mono text-xs font-bold uppercase">
                ⚠️ Not Verified
              </div>
            )}

            {/* EDIT PROFILE BUTTON */}
            <div className="mt-3">
              <Link href="/profile/edit" className="inline-flex items-center gap-2 font-mono text-xs font-bold border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors">
                <Edit2 size={12} /> EDIT PROFILE
              </Link>
            </div>
          </div>

        </section>

        {/* 2. MY LISTINGS SECTION */}
        <section>
          {/* ACTIVE LISTINGS */}
          <h2 className="font-heavy text-xl mb-4 border-b-2 border-black inline-block">
            MY ACTIVE LISTINGS
          </h2>

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
                    <Link href={`/listing/edit?id=${listing.id}`} className="text-xs font-mono underline text-blue-600">
                      Edit Listing
                    </Link>
                  </div>

                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="text-red-600 hover:bg-red-100 p-2 border border-transparent hover:border-red-200 transition-colors"
                    title="Mark as filled / Delete"
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