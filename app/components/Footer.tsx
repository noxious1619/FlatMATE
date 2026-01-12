import Link from "next/link";
import { Github, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-200 border-t-2 border-black z-40 mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT: Branding */}
        <div className="text-center md:text-left">
          <h2 className="font-heavy text-2xl tracking-tight uppercase">
            FLAT<span className="text-brand-orange">MATE</span>
          </h2>
          <p className="font-mono text-sm text-gray-600 mt-1">
            Find your perfect roommate today.
          </p>
        </div>

        {/* CENTER: Links */}
        <div className="flex gap-8 font-mono font-bold text-sm">
          <Link href="/about" className="hover:underline hover:text-brand-orange transition-colors">About</Link>
          <Link href="/contact" className="hover:underline hover:text-brand-orange transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:underline hover:text-brand-orange transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:underline hover:text-brand-orange transition-colors">Terms</Link>
        </div>

        {/* RIGHT: Social icons */}
        <div className="flex gap-4">
          <a href="#" aria-label="GitHub" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            <Github size={18} />
          </a>
          <a href="#" aria-label="Instagram" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            <Instagram size={18} />
          </a>
          <a href="#" aria-label="Twitter" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            <Twitter size={18} />
          </a>
          <a href="mailto:support@flatmate.com" aria-label="Email" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            <Mail size={18} />
          </a>
        </div>
      </div>

      {/* BOTTOM LINE */}
      <div className=" py-4 text-center font-mono text-xs font-bold bg-gray-200">
        © {new Date().getFullYear()} flatMATE Inc. All rights reserved.
      </div>
    </footer>
  );
}
