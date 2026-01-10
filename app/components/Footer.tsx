import { Github, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-32 border-2 border-black bg-white px-6 py-10 shadow-retro">
      <div className="max-w-9xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* LEFT: Branding */}
        <div className="text-center md:text-left">
          <h2 className="font-heavy text-2xl tracking-tight">
            FLAT<span className="text-brand-orange">MATE</span>
          </h2>
          <p className="font-mono text-sm text-gray-600 mt-1">
            Find a roomate.
          </p>
        </div>

        {/* CENTER: Links */}
        <div className="flex gap-6 font-mono text-sm">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>

        {/* RIGHT: Social icons */}
        <div className="flex gap-4">
          <a href="#" aria-label="GitHub">
            <Github className="hover:scale-110 transition" />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram className="hover:scale-110 transition" />
          </a>
          <a href="#" aria-label="Twitter">
            <Twitter className="hover:scale-110 transition" />
          </a>
          <a href="#" aria-label="Email">
            <Mail className="hover:scale-110 transition" />
          </a>
        </div>
      </div>

      {/* BOTTOM LINE */}
      <div className="mt-6 text-center font-mono text-xs text-gray-500">
        © {new Date().getFullYear()} FLATMATE ·
      </div>
    </footer>
  );
}
