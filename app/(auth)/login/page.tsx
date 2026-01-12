"use client";

import Link from "next/link";
import { ArrowLeft, Zap, Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/feed");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-xs font-mono">
          {error}
        </div>
      )}
      <div className="relative group">
        <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
          <Mail size={18} />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="relative group">
        <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
          <Lock size={18} />
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-orange text-black border-2 border-black py-3 font-mono font-bold text-lg hover:bg-brand-yellow transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "LOGGING IN..." : "LOGIN"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed");
    }
  }, [status, router]);

  if (status === "loading") return null;
  return (
    <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* BACKGROUND DECORATION (The Tape) */}
      <div className="absolute top-4 -right-10 rotate-12 bg-black text-white py-2 px-27 font-mono text-sm font-bold z-0 pointer-events-none opacity-50">
        STUDENTS ONLY /// STUDENTS ONLY
      </div>

      {/* BACK BUTTON */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 font-mono font-bold hover:underline z-10"
      >
        <ArrowLeft size={20} />
        BACK TO HOME
      </Link>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white border-2 border-black p-8 relative z-10 shadow-retro">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-orange border-2 border-black flex items-center justify-center mx-auto mb-4 
                rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transform transition-transform duration-500 hover:rotate-180">
            <Zap size={24} fill="black" />
          </div>
          <h1 className="font-heavy text-4xl mb-2 uppercase">Welcome In</h1>
          <p className="font-mono text-sm text-gray-600">
            Exclusive access for <br />
            <span className="bg-brand-yellow px-1 border border-black text-black inline-block"
              style={{ transform: "rotate(-2deg)" }}>College Students</span>
          </p>
        </div>

        {/* LOGIN FORM */}
        <LoginForm />

        {/* Sign Up LINK */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-gray-500">
            Not have an account?{' '}
            <Link href="/signup" className="font-bold underline text-black hover:text-[#FF914D]">
              Sign Up here
            </Link>
          </p>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-gray-400 font-mono text-xs">OR</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/feed" })}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black py-3 px-4 font-mono font-bold text-sm hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-retro hover:-translate-y-1 active:translate-y-0 active:shadow-none mb-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          CONTINUE WITH GOOGLE
        </button>


        {/* FOOTER NOTE */}
        <p className="text-center font-mono text-xs text-gray-400 mt-8">
          By joining, you agree to our <span className="bg-brand-orange px-1 border border-black text-black inline-block underline" style={{ transform: "rotate( 2deg)" }}>No Creep Policy</span>.
        </p>
      </div>
    </main>
  );
}