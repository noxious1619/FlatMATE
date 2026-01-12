"use client";

import Link from "next/link";
import Image from "next/image";
import logoIcon from "../logo-icon.png";
import { LogOut, Plus, User, Menu, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-brand-bg border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-heavy tracking-tighter flex items-center gap-2 group">
          <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
            <Image src={logoIcon} alt="flatMATE Logo" fill className="object-contain" />
          </div>
          <span>flatMATE</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/feed" className="font-mono font-bold hover:underline underline-offset-4 decoration-2">
            <Search size={16} className="inline-block mb-1 mr-1" />
            Find Room
          </Link>

          {session ? (
            <>
              <Link href="/listing/create">
                <button className="flex items-center gap-2 bg-[#FFDE59] border-2 border-black px-4 py-2 font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none">
                  <Plus size={18} strokeWidth={3} />
                  POST LISTING
                </button>
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 font-mono font-bold border-2 border-black px-4 py-2 bg-white hover:bg-gray-50 transition-colors">
                  <User size={18} />
                  <span>{session.user?.name?.split(" ")[0] || "Profile"}</span>
                </button>

                {/* DROPDOWN */}
                <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                  <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-w-[200px]">
                    <Link href="/profile" className="px-4 py-3 font-mono font-bold hover:bg-yellow-50 border-b-2 border-black">
                      My Profile
                    </Link>
                    <Link href="/saved-listings" className="px-4 py-3 font-mono hover:bg-yellow-50 border-b-2 border-black">
                      Saved Listings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="px-4 py-3 font-mono font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="font-mono font-bold hover:underline">
                Login
              </Link>
              <Link href="/signup">
                <button className="bg-black text-white border-2 border-black px-6 py-2 font-mono font-bold hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                  SIGN UP
                </button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white p-4 flex flex-col gap-4 shadow-xl">
          <Link href="/feed" className="font-mono font-bold text-lg py-2 border-b border-gray-200">
            Find Room
          </Link>
          {session ? (
            <>
              <Link href="/listing/create" className="flex items-center gap-2 font-mono font-bold text-lg py-2 border-b border-gray-200">
                <Plus size={18} /> POST LISTING
              </Link>
              <Link href="/profile" className="font-mono font-bold text-lg py-2 border-b border-gray-200">
                My Profile
              </Link>
              <Link href="/saved-listings" className="font-mono font-bold text-lg py-2 border-b border-gray-200">
                Saved Listings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="font-mono font-bold text-lg py-2 text-red-600 flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="font-mono font-bold text-lg py-2 border-b border-gray-200">
                Login
              </Link>
              <Link href="/signup" className="font-mono font-bold text-lg py-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}