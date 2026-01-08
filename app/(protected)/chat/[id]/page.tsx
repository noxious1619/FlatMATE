"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, ShieldAlert, MoreVertical, Phone } from "lucide-react";

// MOCK MESSAGES
const INITIAL_MESSAGES = [
  { id: 1, text: "Hi, I saw your listing for the shared room.", sender: "me", time: "2:30 PM" },
  { id: 2, text: "Hey! Yes, it's available. Are you a student?", sender: "them", time: "2:31 PM" },
  { id: 3, text: "Yeah, 3rd year CSE. Enrollment ends in 148.", sender: "me", time: "2:32 PM" },
  { id: 4, text: "Perfect. We are looking for someone from CSE/IT only. When can you visit?", sender: "them", time: "2:35 PM" },
];

export default function ChatRoom() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when message is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add message to list
    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <main className="flex flex-col h-screen bg-brand-bg">
      
      {/* 1. HEADER (Fixed) */}
      <header className="bg-white border-b-2 border-black p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Link href="/chats" className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full border border-black overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" alt="Avatar" />
            </div>
            <div>
              <h1 className="font-heavy text-lg leading-none">Amit Kumar</h1>
              <p className="font-mono text-xs text-green-600 font-bold flex items-center gap-1">
                ● Online
              </p>
            </div>
          </div>
        </div>

        {/* Safety Actions */}
        <div className="flex gap-2">
            <button className="p-2 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors" title="Report User">
                <ShieldAlert size={20} />
            </button>
        </div>
      </header>

      {/* 2. MESSAGES AREA (Scrollable) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#E6ECEE]"
      >
        {/* Safety Notice */}
        <div className="text-center my-4">
            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-yellow-300">
                ⚠️ Never share financial info or OTPs.
            </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[75%] p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
              ${msg.sender === "me" 
                ? "bg-black text-white rounded-l-lg rounded-tr-lg" 
                : "bg-white text-black rounded-r-lg rounded-tl-lg"
              }`}
            >
              <p className="font-mono text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] font-bold mt-1 text-right ${msg.sender === 'me' ? 'text-gray-400' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. INPUT AREA (Fixed Bottom) */}
      <footer className="bg-white border-t-2 border-black p-4">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-gray-50 border-2 border-black p-3 font-mono focus:outline-none focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_black] transition-all"
          />
          <button 
            type="submit"
            className="bg-brand-orange border-2 border-black p-3 hover:bg-black hover:text-white transition-colors shadow-retro hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
          >
            <Send size={20} />
          </button>
        </form>
      </footer>

    </main>
  );
}