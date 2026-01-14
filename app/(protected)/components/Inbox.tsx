"use client";

import { useState, useEffect } from "react";
import { Check, X, User as UserIcon, MessageSquare, Phone, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// --- TYPES ---

// 1. The shape of data coming from the API
type IncomingRequest = {
  id: string;
  status: string;
  sender: {
    id: string;
    name: string | null;
    college: string | null;
    image: string | null;
  };
  listing: {
    id: string;
    title: string;
  };
};

// 2. The shape of the Contact Info (received only after accepting)
type ContactInfo = {
  phone: string | null;
  email: string | null;
}

export default function Inbox() {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the "Match" Modal
  const [selectedRequest, setSelectedRequest] = useState<IncomingRequest | null>(null);
  const [revealedContact, setRevealedContact] = useState<ContactInfo | null>(null);

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests/incoming");
        
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        console.log(" Incoming Requests Data:", data);
        // The API returns pending, accepted, and rejected. 
        // For the main list, we usually only want PENDING requests to act on.
        // Or if you want to see history, keep all. Let's filter for PENDING for now.
        const pendingOnly = data.filter((r: IncomingRequest) => r.status === "PENDING" || r.status === "ACCEPTED");
        console.log("pending only:", pendingOnly);
        
        setRequests(pendingOnly);
      } catch (error) {
        console.error(error);
        toast.error("Could not load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // --- HANDLERS ---

// --- HANDLE ACCEPT (Fetch Contact Info) ---
    const handleAccept = async (req: IncomingRequest) => {
      const toastId = toast.loading("Connecting...");

      try {
        const res = await fetch("/api/requests/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId: req.id, status: "ACCEPTED" }),
        });

        if (!res.ok) throw new Error("Failed to accept");

        const data = await res.json();
        toast.success("Connection Made!", { id: toastId });
        
        // Save the contact info from the server to state
        setRevealedContact(data.contactInfo);
        setSelectedRequest(req);

      } catch (error) {
        console.error(error);
        toast.error("Failed to accept request", { id: toastId });
      }
    };

    // --- HANDLE DECLINE (Reject Request) ---
  const handleDecline = async (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id)); // Remove from UI instantly
    toast.success("Request Declined");

    try {
      await fetch("/api/requests/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id, status: "REJECTED" }),
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 mt-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heavy text-2xl uppercase border-b-3 inline-block">
          Incoming Requests
        </h2>
        <span className="bg-black text-white font-mono text-xs px-2 py-1 rounded-full">
            {requests.length} PENDING
        </span>
      </div>

      {/* EMPTY STATE */}
      {requests.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-gray-50">
          <p className="font-heavy text-gray-400 text-xl">NO PENDING REQUESTS</p>
          <p className="font-mono text-sm text-gray-400">Your inbox is empty.</p>
        </div>
      )}

      {/* REQUEST CARDS */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div 
            key={req.id} 
            className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:translate-x-1 transition-transform"
          >
            {/* Sender Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0 overflow-hidden">
                {req.sender.image ? (
                    <img src={req.sender.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <UserIcon size={24} className="text-black" />
                )}
              </div>
              <div>
                <h3 className="font-heavy text-lg leading-none">{req.sender.name || "Anonymous User"}</h3>
                <p className="font-mono text-xs text-gray-500 uppercase mb-1">{req.sender.college || "College Unknown"}</p>
                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 border border-black text-[10px] font-bold">
                  <span>INTERESTED IN:</span>
                  <span className="text-brand-orange truncate max-w-[150px]">{req.listing.title}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
              <button 
                onClick={() => handleDecline(req.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border-2 border-black font-bold hover:bg-red-100 text-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-none"
              >
                <X size={18} /> DECLINE
              </button>
              <button 
                onClick={() => handleAccept(req)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black text-white border-2 border-black font-bold hover:bg-green-600 hover:border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-none"
              >
                <Check size={18} /> ACCEPT
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- REVEAL CONTACT MODAL (Placeholder for Step 4) --- */}
{/* --- REVEAL CONTACT MODAL --- */}
      {selectedRequest && revealedContact && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black w-full max-w-md p-6 shadow-retro relative animate-in zoom-in-95 duration-200">
            
            <button 
                onClick={() => { setSelectedRequest(null); setRevealedContact(null); }} 
                className="absolute top-2 right-2 p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="font-heavy text-2xl uppercase">It's a Match!</h2>
              <p className="font-mono text-sm text-gray-600">
                You have accepted <strong>{selectedRequest.sender.name || "User"}</strong>.
              </p>
            </div>

            <div className="space-y-4 bg-gray-50 p-5 border-2 border-black mb-6 shadow-inner">
              <div className="flex items-center gap-4 border-b-2 border-dashed border-gray-300 pb-3">
                <div className="bg-white p-2 border border-black"><Phone size={20} /></div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                    <p className="font-heavy text-lg">{revealedContact.phone || "Not Shared"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 border border-black"><Mail size={20} /></div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                    <p className="font-heavy text-lg break-all text-sm md:text-lg">{revealedContact.email || "Not Shared"}</p>
                </div>
              </div>
            </div>

            <a 
              href={`https://wa.me/${revealedContact.phone?.replace(/\D/g,'')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 bg-[#25D366] text-white border-2 border-black font-heavy text-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <MessageSquare size={20} /> OPEN WHATSAPP
            </a>

          </div>
        </div>
      )}
    </div>
  );
}