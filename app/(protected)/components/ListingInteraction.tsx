"use client";

import { useState } from "react";
import { Phone, Mail, X, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ListingInteractionProps {
  listingId: string;
  ownerId: string;
  currentUserId: string;
  initialStatus: string | null;
  ownerName: string;
}

type ContactInfo = {
  phone: string | null;
  email: string | null;
};

export default function ListingInteraction({
  listingId,
  ownerId,
  currentUserId,
  initialStatus,
  ownerName,
}: ListingInteractionProps) {
  const [status, setStatus] = useState(initialStatus);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contact, setContact] = useState<ContactInfo | null>(null);



  const router = useRouter();

  // ---------------- SEND REQUEST ----------------
  const handleSendRequest = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/request-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      console.log("Response Status:", res.status);

      if (res.status === 409) {
        toast.error("You have already sent request to this listing");
        return;
      }
      if (res.status === 400) {
        toast.error("Cant send Request to your own listing");
        return;
      }

      if (!res.ok) {
        toast.error("Something went wrong. Try again.");
        return;
      }

      toast.success("Request sent!");
      setStatus("PENDING");
      setShowRequestModal(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };


  // ---------------- FETCH CONTACT ----------------
  const handleFetchContact = async () => {
    setContactLoading(true);

    try {
      const res = await fetch(`/api/connection/${listingId}/contact`);

      if (!res.ok) {
        toast.error("Contact not available yet");
        return;
      }

      const data = await res.json();
      setContact(data);
      setShowContactModal(true);
    } catch {
      toast.error("Failed to load contact details");
    } finally {
      setContactLoading(false);
    }
  };

  // ---------------- UI STATES ----------------

  // ✅ ACCEPTED
  if (status === "ACCEPTED") {
    return (
      <>
        <button
          onClick={handleFetchContact}
          disabled={contactLoading}
          className="w-full bg-green-600 text-white font-heavy uppercase py-4 border-2 border-black hover:bg-green-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2"
        >
          {contactLoading ? <Loader2 className="animate-spin" /> : <Check size={20} />}
          See Contact Details
        </button>

        {/* CONTACT MODAL */}
        {showContactModal && contact && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-black p-6 w-full max-w-sm shadow-retro relative">
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-2 right-2 hover:bg-gray-100 p-1"
              >
                <X size={20} />
              </button>

              <h3 className="font-heavy text-2xl mb-4 uppercase">It's a Match!</h3>
              <p className="font-mono text-sm mb-6">
                Here is how to reach {ownerName}:
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                  <Phone size={20} />
                  <span className="font-mono font-bold text-lg">
                    {contact.phone || "Not shared"}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                  <Mail size={20} />
                  <span className="font-mono font-bold text-sm">
                    {contact.email || "Not shared"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="w-full mt-6 bg-black text-white font-bold py-3 border-2 border-black hover:bg-gray-800"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // 🟡 PENDING
  if (status === "PENDING") {
    return (
            
      <button
        disabled
        className="w-full bg-gray-300 text-gray-600 font-heavy uppercase py-4 border-2 border-black cursor-not-allowed"
      >
        Request Pending...
      </button>
    );
  }

  // 🔴 REJECTED
  if (status === "REJECTED") {
    return (
      <button
        disabled
        className="w-full bg-red-100 text-red-600 font-heavy uppercase py-4 border-2 border-black cursor-not-allowed"
      >
        Request Declined
      </button>
    );
  }

  // ⚫ DEFAULT
  return (

    <>
      <button
        onClick={() => setShowRequestModal(true)}
        className="w-full bg-black text-white font-heavy uppercase py-4 border-2 border-black hover:bg-brand-orange hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
      >
        Interested?
      </button>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black p-6 w-full max-w-sm shadow-retro">
            <h3 className="font-heavy text-2xl mb-2 uppercase">Send Request?</h3>
            <p className="font-mono text-sm text-gray-600 mb-6">
              This will let {ownerName} know you are interested.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowRequestModal(false)}
                className="font-mono font-bold py-3 border-2 border-black hover:bg-gray-100"
              >
                CANCEL
              </button>

              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="bg-black text-white font-mono font-bold py-3 border-2 border-black hover:bg-brand-orange hover:text-black"
              >
                {loading ? "SENDING..." : "REQUEST"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
