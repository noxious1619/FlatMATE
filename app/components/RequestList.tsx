// app/owner/requests/RequestList.tsx
"use client";

import React, { useState } from "react";
import { MessageSquare, X, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { handleRequestResponse } from "../api/request-message/action"; // Import the action

// Define the shape of the data
type RequestItem = {
  id: string;
  senderName: string;
  listingTitle: string;
  createdAt: string; // Pre-formatted string from server
  message?: string;
};

export default function RequestList({ initialRequests }: { initialRequests: RequestItem[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const onAction = async (id: string, action: "ACCEPT" | "IGNORE") => {
    // 1. OPTIMISTIC UPDATE: Remove from UI immediately
    setRequests((prev) => prev.filter((req) => req.id !== id));
    setLoadingId(id);

    // 2. Alert (Optional UX touch)
    if (action === "ACCEPT") {
      alert("Contact Details Shared! They can now call you.");
    }

    // 3. SERVER UPDATE: Sync with DB in background
    const result = await handleRequestResponse(id, action);

    if (!result.success) {
      alert("Failed to update. Please refresh.");
      // Ideally, you would revert the state here, but for MVP reload is fine
      window.location.reload();
    }
    setLoadingId(null);
  };

  return (
    <main className="min-h-screen bg-brand-bg p-4 md:p-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono font-bold hover:underline">
          <ArrowLeft size={20} /> BACK
        </Link>
        <div className="bg-brand-yellow border-2 border-black px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          INBOX: {requests.length}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-black flex items-center justify-center -rotate-3">
              <MessageSquare className="text-white" size={24} />
           </div>
           <h1 className="font-heavy text-4xl uppercase tracking-tight">Connection Requests</h1>
        </div>

        {/* REQUESTS LIST */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="border-2 border-black border-dashed p-10 text-center font-mono text-gray-500">
              No new requests. Go touch grass.
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="group relative bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                {/* DECORATIVE 'NEW' TAG */}
                <div className="absolute -top-3 -right-3 bg-brand-orange border-2 border-black px-2 py-0.5 text-xs font-heavy text-white rotate-6">
                  NEW!
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  
                  {/* TEXT INFO */}
                  <div>
                    <h3 className="font-bold text-xl mb-1">
                      <span className="bg-brand-yellow px-1 border border-black mr-2">
                        {req.senderName}
                      </span>
                      wants to connect.
                    </h3>
                    <p className="font-mono text-sm text-gray-600 mb-2">
                      RE: <span className="font-bold underline">{req.listingTitle}</span>
                    </p>
                    {req.message && (
                        <p className="text-sm text-gray-500 italic border-l-2 border-gray-300 pl-2 mb-2">
                            "{req.message}"
                        </p>
                    )}
                    <p className="font-mono text-xs text-gray-400">
                      Received {req.createdAt}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    
                    {/* IGNORE BUTTON */}
                    <button
                      onClick={() => onAction(req.id, "IGNORE")}
                      disabled={loadingId === req.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-mono font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <X size={18} />
                      IGNORE
                    </button>

                    {/* SHARE BUTTON */}
                    <button
                      onClick={() => onAction(req.id, "ACCEPT")}
                      disabled={loadingId === req.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-black text-white border-2 border-transparent hover:bg-gray-800 hover:border-black transition-all shadow-[2px_2px_0px_0px_rgba(100,100,100,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50"
                    >
                      <Check size={18} />
                      SHARE CONTACT
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}