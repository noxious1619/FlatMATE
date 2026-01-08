"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token || !email) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`/api/auth/verify-email?token=${token}&email=${email}`);
        const data = await res.json();  

        if (res.ok) {
          setStatus("success");
          setMessage("Email verified successfully! You can now login.");
          // Optional: Redirect after a few seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token, email, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          {status === "loading" && (
            <div className="flex flex-col items-center">
               <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-900">{message}</p>
              <p className="mt-2 text-sm text-gray-500">
                Redirecting to login in 3 seconds...
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-900">{message}</p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
