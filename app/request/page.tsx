"use client";

import React, { useState } from 'react';
import { Phone, X, Check, GraduationCap, Mail, ArrowLeft, Zap, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

// 1. TYPE DEFINITION (As provided)
type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  college: string | null;
  isVerified?: boolean; 
  emailVerified: string | null;
  // Adding phone for the "Reveal" functionality (assumed exists in DB or relation)
  phone?: number | string | null; 
};

// 2. MOCK DATA (Reflected from DB Structure)
const MOCK_REQUESTS: UserProfile[] = [
  {
    id: "user_1",
    name: "Rahul Sharma",
    email: "rahul.s@dtu.ac.in",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    college: "Delhi Technological University (DTU)",
    isVerified: true,
    emailVerified: "2026-01-01",
    phone: "+91 98765 43210"
  },
  {
    id: "user_2",
    name: "Priya Verma",
    email: "priya.v@nsut.ac.in",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    college: "Netaji Subhas University of Technology (NSUT)",
    isVerified: true,
    emailVerified: "2026-01-02",
    phone: "+91 9123456789"
  }
];

export default function OwnerRequestsPage() {
  const [requests, setRequests] = useState<UserProfile[]>(MOCK_REQUESTS);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDecline = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleAccept = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-4 md:p-8 font-mono">
      
      {/* --- HEADER --- */}
      <div className="max-w-3xl mx-auto mb-8 relative">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold mb-6 hover:underline">
          <ArrowLeft className="w-5 h-5" /> BACK TO DASHBOARD
        </Link>
        
        <div className="bg-[#FFDE59] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-black text-white p-2">
              <Zap size={24} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Incoming Requests</h1>
          </div>
          <p className="font-bold text-gray-700">
            You have <span className="bg-black text-white px-2 py-0.5 mx-1">{requests.length}</span> students waiting.
          </p>
        </div>
      </div>

      {/* --- REQUESTS LIST --- */}
      <div className="max-w-3xl mx-auto space-y-6">
        {requests.length === 0 ? (
          <div className="bg-white border-2 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-gray-500 font-bold uppercase">No pending requests.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white border-2 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
              
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                
                {/* Avatar */}
                <div className="shrink-0 relative">
                  <div className="w-20 h-20 bg-gray-100 border-2 border-black rounded-full overflow-hidden">
                    <img src={req.image || ""} alt={req.name || "User"} className="w-full h-full object-cover" />
                  </div>
                  {(req.isVerified || req.emailVerified) && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Verified Student">
                      <BadgeCheck size={16} />
                    </div>
                  )}
                </div>

                {/* Details (No Message Box) */}
                <div className="flex-1 w-full">
                  <div className="mb-4">
                    <h3 className="text-2xl font-black uppercase mb-1">{req.name}</h3>
                    
                    {/* College Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#F0F0F0] border border-black px-3 py-1 text-xs font-bold">
                      <GraduationCap size={14} /> 
                      {req.college || "College Not Listed"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => handleAccept(req)}
                      className="flex-1 bg-black text-white border-2 border-black py-3 font-bold hover:bg-[#FFDE59] hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> ACCEPT
                    </button>
                    <button 
                      onClick={() => handleDecline(req.id)}
                      className="flex-1 bg-white text-black border-2 border-black py-3 font-bold hover:bg-red-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2"
                    >
                      <X size={18} /> DECLINE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- THE RETRO POPUP (MODAL) --- */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md border-2 border-black p-0 shadow-[12px_12px_0px_0px_#FF914D] relative animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <h2 className="font-black text-xl uppercase tracking-wider">Contact Unlocked</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-[#FFDE59]">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-[#FFDE59] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-black" />
              </div>

              <h3 className="text-2xl font-black uppercase mb-2">Connected!</h3>
              <p className="text-sm font-bold text-gray-600 mb-8">
                You can now contact {selectedUser.name} directly.
              </p>

              <div className="space-y-4 text-left">
                {/* Phone Block */}
                <div className="bg-[#F0F0F0] border-2 border-black p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="bg-white border-2 border-black p-2">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Mobile Number</p>
                    <p className="text-lg font-black">{selectedUser.phone || "Not provided"}</p>
                  </div>
                </div>

                {/* Email Block */}
                <div className="bg-[#F0F0F0] border-2 border-black p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="bg-white border-2 border-black p-2">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Email Address</p>
                    <p className="text-lg font-black break-all">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-8 bg-[#FF914D] border-2 border-black py-3 font-black text-black hover:bg-black hover:text-[#FF914D] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                CLOSE POPUP
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}