import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { MessageSquare, ChevronRight, ShieldCheck } from "lucide-react";

// MOCK DATA: List of active conversations
const MOCK_CHATS = [
  {
    id: "1",
    name: "Amit Kumar",
    lastMessage: "Is the room still available? I can come visit today.",
    time: "2:30 PM",
    unread: true,
    avatarSeed: "Amit",
    listingTitle: "Shared Room in Sec 22"
  },
  {
    id: "2",
    name: "Priya Sharma",
    lastMessage: "Okay, let me ask my parents and confirm.",
    time: "Yesterday",
    unread: false,
    avatarSeed: "Priya",
    listingTitle: "Single Room Pocket 4"
  },
  {
    id: "3",
    name: "Rahul Verma",
    lastMessage: "What is the security deposit amount?",
    time: "2 Days ago",
    unread: false,
    avatarSeed: "Rahul",
    listingTitle: "Flat for Boys"
  }
];

export default function InboxPage() {
  const hasChats = MOCK_CHATS.length > 0;

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <div className="max-w-2xl mx-auto p-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heavy text-3xl uppercase">Inbox</h1>
          <div className="bg-black text-white font-mono text-xs px-2 py-1 font-bold">
            {MOCK_CHATS.filter(c => c.unread).length} NEW
          </div>
        </div>

        {/* CHAT LIST */}
        {hasChats ? (
          <div className="space-y-4">
            {MOCK_CHATS.map((chat) => (
              <Link href={`/chat/${chat.id}`} key={chat.id}>
                <div className={`
                  group relative bg-white border-2 border-black p-4 flex items-center gap-4 transition-all
                  ${chat.unread ? 'shadow-retro' : 'opacity-80 hover:opacity-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]'}
                `}>
                  
                  {/* UNREAD DOT */}
                  {chat.unread && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-brand-orange border border-black rounded-full animate-pulse"></div>
                  )}

                  {/* AVATAR */}
                  <div className="w-14 h-14 bg-gray-100 border-2 border-black rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.avatarSeed}`} 
                      alt="Avatar" 
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-heavy text-lg truncate flex items-center gap-2">
                        {chat.name}
                        <ShieldCheck size={14} className="text-green-600" />
                      </h3>
                      <span className="font-mono text-xs text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
                    </div>
                    
                    <p className="font-mono text-xs text-gray-500 truncate mb-1 bg-gray-100 inline-block px-1">
                      RE: {chat.listingTitle}
                    </p>
                    
                    <p className={`font-mono text-sm truncate ${chat.unread ? 'text-black font-bold' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* ARROW */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={20} />
                  </div>

                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* EMPTY STATE (If no chats) */
          <div className="text-center py-20 border-2 border-dashed border-gray-400">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 grayscale">
              <MessageSquare size={32} />
            </div>
            <h3 className="font-heavy text-xl text-gray-500">No Messages Yet</h3>
            <p className="font-mono text-sm text-gray-400">Start a conversation from a listing.</p>
          </div>
        )}

      </div>
    </main>
  );
}