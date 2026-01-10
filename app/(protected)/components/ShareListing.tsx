"use client";

import React, { useState, useEffect } from "react";
import { Share2, X, Copy, Check, Facebook, Twitter, MessageCircle } from "lucide-react";

export default function ShareListing() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  // Grab the URL only after the component mounts on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareToSocial = (platform: "whatsapp" | "twitter" | "facebook") => {
    const text = "Check out this place on FlatMate!";
    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text + " " + currentUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
    }
    window.open(url, "_blank");
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
      >
        <Share2 size={20} />
      </button>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* MODAL BOX */}
          <div className="bg-white border-2 border-black w-full max-w-sm relative shadow-[8px_8px_0px_0px_#D16002] animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b-2 border-black bg-gray-50">
              <h3 className="font-heavy text-lg uppercase">Share Listing</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-red-100 p-1 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Social Icons */}
              <div className="flex justify-center gap-4">
                <button onClick={() => shareToSocial("whatsapp")} className="p-3 border-2 border-black rounded-full hover:bg-green-100 transition-colors">
                  <MessageCircle size={24} className="text-green-600" />
                </button>
                <button onClick={() => shareToSocial("twitter")} className="p-3 border-2 border-black rounded-full hover:bg-blue-100 transition-colors">
                  <Twitter size={24} className="text-blue-400" />
                </button>
                <button onClick={() => shareToSocial("facebook")} className="p-3 border-2 border-black rounded-full hover:bg-blue-50 transition-colors">
                  <Facebook size={24} className="text-blue-700" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="font-mono text-xs text-gray-400">OR COPY LINK</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              {/* Copy Link Input */}
              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  value={currentUrl} 
                  className="w-full border-2 border-black bg-gray-100 p-3 pr-12 font-mono text-sm text-gray-600 focus:outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
              </div>
              
              {isCopied && (
                 <p className="text-center font-mono text-xs text-green-600 font-bold animate-pulse">
                    Link copied to clipboard!
                 </p>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}