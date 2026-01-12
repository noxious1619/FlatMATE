"use client";

import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, ArrowRight } from "lucide-react";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

// Component to access search params securely
function PendingContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return (
        <>
            <p className="font-mono text-sm mb-6">
                We've sent a verification link to: <br />
                <span className="bg-[#FFDE59] px-1 font-bold border border-black inline-block mt-2">
                    {email || "your email address"}
                </span>
            </p>

            <div className="bg-gray-50 border-2 border-black p-4 mb-6 font-mono text-xs text-gray-600">
                <p className="flex items-center gap-2 mb-2 font-bold text-black">
                    <CheckCircle size={16} /> NEXT STEPS:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Open your inbox</li>
                    <li>Click the verification link</li>
                    <li>Get access to flatMAITES</li>
                </ol>
            </div>

            <p className="font-mono text-xs text-gray-500 mb-6">
                Didn't receive it? Check your spam folder or try waiting a minute.
            </p>

            <Link
                href="/login"
                className="block w-full text-center bg-black text-white border-2 border-black py-3 font-mono font-bold text-lg hover:bg-[#FFDE59] hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
            >
                PROCEED TO LOGIN
            </Link>
        </>
    );
}

export default function VerificationPendingPage() {
    toast.error("Please verify your email to continue.");
    return (
        <main className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* BACKGROUND DECORATION */}
            <div className="absolute top-10 -right-10 rotate-12 bg-black text-white py-2 px-20 font-mono text-sm font-bold z-0 pointer-events-none opacity-20">
                DELHI STUDENTS ONLY /// DELHI STUDENTS ONLY
            </div>

            {/* BACK BUTTON */}
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 font-mono font-bold hover:underline z-10"
            >
                <ArrowLeft size={20} />
                BACK TO HOME
            </Link>

            {/* CARD */}
            <div className="w-full max-w-md bg-white border-2 border-black p-8 relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-10 text-center">

                {/* ICON */}
                <div className="w-16 h-16 bg-[#FF914D] border-2 border-black flex items-center justify-center mx-auto mb-6 rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Mail size={32} strokeWidth={2.5} className="text-black" />
                </div>

                <h1 className="font-black text-3xl mb-4 uppercase tracking-tighter">Check Your Mail!</h1>

                <Suspense fallback={<p className="font-mono text-sm mb-6">Loading details...</p>}>
                    <PendingContent />
                </Suspense>

            </div>
        </main>
    );
}
