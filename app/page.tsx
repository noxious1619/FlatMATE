import Link from "next/link";
import Navbar from "./components/Navbar";
import PoliceTape from "./components/PoliceTape";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg text-black overflow-x-hidden relative">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative pt-30 pb-10 text-center px-4">
        
        <PoliceTape />

        <div className="relative z-10 mt-40 max-w-4xl mx-auto">
          <h1 className="font-heavy text-7xl md:text-9xl leading-none tracking-tighter mb-6 drop-shadow-sm">
            FLAT
            <span className="text-brand-orange">MATE</span>
          </h1>

          <p className="font-mono text-lg md:text-xl font-bold max-w-2xl mx-auto mb-10 leading-relaxed bg-white border-2 border-black p-4 inline-block -rotate-1 shadow-retro">
            The private club for <span className="bg-brand-yellow px-1">College</span> students.<br />
            Find a room without the drama.
          </p>

          <br />

          <button className="font-heavy text-2xl px-10 py-5 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all shadow-retro hover:shadow-retro-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-retro-active">
            GET VERIFIED &rarr;
          </button>

          <Footer />
        </div>
      </div>
    </main>
  );
}