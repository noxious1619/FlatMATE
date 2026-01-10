"use client";

import Navbar from "@/app/components/Navbar"; 
import { ArrowLeft, MapPin, IndianRupee, ShieldCheck, Share2, X, Phone, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// MOCK DATA
const MOCK_LISTING = {
  id: "1",
  rent: "6,500",
  deposit: "6,500",
  location: "Pocket 4, Sector 22, Rohini",
  gender: "Male",
  description: "Looking for a chill flatmate. The room is fully furnished with a bed and cupboard. We have a cook who comes twice a day. No restrictions on guests as long as they aren't noisy after 11 PM. Walking distance from MAIT gate number 3.",
  tags: ["AC", "No Brokerage", "Wifi Included", "Cook Available", "Geyser"],
  lister: {
    name: "Amit Kumar",
    batch: "CSE - 2025",
    verified: true,
    phone: "+91 98765 43210", // Hidden until accepted
    email: "amit.k@example.com"
  },
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
  ]
};

export default function ListingDetails() {
  const listing = MOCK_LISTING; 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // STATE MANAGEMENT: "NONE" | "PENDING" | "ACCEPTED"
  // Change this manually to 'ACCEPTED' to test the contact view!
  const [connectionStatus, setConnectionStatus] = useState<"NONE" | "PENDING" | "ACCEPTED">("NONE");

  const handleSendRequest = () => {
    // API Call would go here
    console.log("Request sent to owner!");
    setConnectionStatus("PENDING");
    setIsPopupOpen(false);
  };

  // Helper to determine Button Text & Style
  const getButtonConfig = () => {
    switch(connectionStatus) {
      case "ACCEPTED":
        return { 
          text: "See Contact Details", 
          style: "bg-green-500 text-white border-green-700 hover:bg-green-400",
          disabled: false,
          icon: <Phone size={20} className="mr-2" />
        };
      case "PENDING":
        return { 
          text: "Request Sent", 
          style: "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed",
          disabled: true,
          icon: <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full mr-2" />
        };
      default: // NONE
        return { 
          text: "Interested?", 
          style: "bg-black text-white hover:bg-brand-orange hover:text-black hover:border-black",
          disabled: false,
          icon: null
        };
    }
  };

  const btnConfig = getButtonConfig();

  return (
    <main className="min-h-screen bg-brand-bg pb-32">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        
        {/* BACK BUTTON */}
        <Link href="/feed" className="inline-flex items-center gap-2 font-mono font-bold mb-6 hover:underline">
            <ArrowLeft size={20} /> BACK TO FEED
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: IMAGES & INFO */}
            <div className="md:col-span-2 space-y-6">
                {/* 1. HERO IMAGE */}
                <div className="retro-card p-2 rotate-1">
                    <img 
                        src={listing.images[0]} 
                        alt="Room Main" 
                        className="w-full h-64 md:h-96 object-cover border-2 border-black"
                    />
                </div>

                {/* 2. TITLE & PRICE */}
                <div>
                    <div className="flex justify-between items-start">
                        <h1 className="font-heavy text-3xl md:text-5xl uppercase leading-none mb-2">
                            Shared Room
                        </h1>
                        <button className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Share2 size={20} />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2 font-mono text-gray-600 mb-4">
                        <MapPin size={18} /> {listing.location}
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span className="block font-mono text-xs text-gray-500">RENT</span>
                            <span className="font-heavy text-xl flex items-center">
                                <IndianRupee size={16} strokeWidth={3}/>{listing.rent}
                            </span>
                        </div>
                        <div className="bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-60">
                            <span className="block font-mono text-xs text-gray-500">DEPOSIT</span>
                            <span className="font-heavy text-xl flex items-center">
                                <IndianRupee size={16} strokeWidth={3}/>{listing.deposit}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. VIBE TAGS */}
                <div>
                    <h3 className="font-heavy text-xl mb-3 uppercase border-b-2 border-black inline-block">The Vibe</h3>
                    <div className="flex flex-wrap gap-3">
                        {listing.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 font-mono font-bold border-2 border-black bg-white rounded-full text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 4. DESCRIPTION */}
                <div className="bg-white border-2 border-black p-6 shadow-retro relative">
                    <div className="absolute -top-3 -right-3 bg-brand-yellow px-2 py-1 border-2 border-black font-mono text-xs font-bold rotate-3">
                        READ ME
                    </div>
                    <p className="font-mono leading-relaxed text-sm md:text-base">
                        {listing.description}
                    </p>
                </div>
            </div>

            {/* RIGHT COLUMN: LISTER PROFILE (Sticky) */}
            <div className="md:col-span-1">
                <div className="sticky top-24">
                    <div className="bg-white border-2 border-black p-6 shadow-retro text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full border-2 border-black mx-auto mb-4 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" alt="Avatar" />
                        </div>
                        
                        <h3 className="font-heavy text-xl">{listing.lister.name}</h3>
                        <p className="font-mono text-sm text-gray-500 mb-2">{listing.lister.batch}</p>
                        
                        <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-xs mb-6">
                            <ShieldCheck size={14} /> VERIFIED STUDENT
                        </div>

                        {/* --- THE DYNAMIC BUTTON --- */}
                        <button 
                            onClick={() => setIsPopupOpen(true)}
                            disabled={btnConfig.disabled}
                            className={`w-full flex items-center justify-center font-heavy uppercase py-4 border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] 
                              ${btnConfig.style} 
                              ${!btnConfig.disabled && "active:translate-y-1 active:shadow-none"}`}
                        >
                            {btnConfig.icon}
                            {btnConfig.text}
                        </button>
                        
                        {connectionStatus !== 'ACCEPTED' && (
                          <p className="text-[10px] font-mono text-gray-400 mt-2">
                              Identity hidden until you match.
                          </p>
                        )}
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* --- THE DYNAMIC POPUP MODAL --- */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border-2 border-black p-6 max-w-sm w-full shadow-retro relative animate-in zoom-in-95 duration-200">
                
                {/* Close Button */}
                <button 
                    onClick={() => setIsPopupOpen(false)}
                    className="absolute top-2 right-2 hover:bg-gray-100 p-1 rounded-full border border-transparent hover:border-black transition-all"
                >
                    <X size={20} />
                </button>

                {/* --- POPUP CONTENT LOGIC --- */}
                {connectionStatus === "ACCEPTED" ? (
                  // STATE: ACCEPTED (Show Contact Info)
                  <div className="text-center">
                     <div className="w-16 h-16 bg-green-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckmarkIcon />
                     </div>
                     <h2 className="font-heavy text-2xl uppercase mb-2">It's a Match!</h2>
                     <p className="font-mono text-sm text-gray-600 mb-6">
                        Here are {listing.lister.name}'s details. Give them a call!
                     </p>
                     
                     <div className="bg-gray-50 border-2 border-black p-4 mb-4 text-left">
                        <div className="flex items-center gap-3 mb-3">
                           <Phone size={18} />
                           <span className="font-bold text-lg">{listing.lister.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <MessageSquare size={18} />
                           <span>{listing.lister.email}</span>
                        </div>
                     </div>

                     <button 
                        onClick={() => window.location.href = `tel:${listing.lister.phone}`}
                        className="w-full font-mono font-bold py-3 bg-black text-white border-2 border-black hover:bg-brand-orange hover:text-black transition-colors"
                     >
                        CALL NOW
                     </button>
                  </div>
                ) : (
                  // STATE: NONE (Confirm Request)
                  <>
                     <h2 className="font-heavy text-2xl uppercase mb-2">Contact Owner?</h2>
                     <p className="font-mono text-sm text-gray-600 mb-6">
                         This will send a notification to <strong>{listing.lister.name}</strong>. If they accept, you will see their phone number.
                     </p>
                     <div className="flex gap-3">
                         <button 
                             onClick={() => setIsPopupOpen(false)}
                             className="flex-1 font-mono font-bold py-3 border-2 border-black hover:bg-gray-100 transition-colors"
                         >
                             Cancel
                         </button>
                         <button 
                             onClick={handleSendRequest}
                             className="flex-1 font-mono font-bold py-3 border-2 border-black bg-brand-orange text-white hover:bg-orange-500 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                         >
                             Send Request
                         </button>
                     </div>
                  </>
                )}
            </div>
        </div>
      )}

    </main>
  );
}

// Simple checkmark component for the accepted state
function CheckmarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}