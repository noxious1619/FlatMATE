import { Ban } from "lucide-react";

export default function BlockedPage() {
    return (
        <main className="min-h-screen bg-red-600 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black p-10 max-w-lg w-full text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-center mb-6">
                    <Ban size={64} className="text-red-600" />
                </div>

                <h1 className="font-heavy text-5xl uppercase mb-4 tracking-tighter">ACCESS DENIED</h1>

                <p className="font-mono text-lg mb-6">
                    Your account has been flagged for violating our community guidelines. You cannot access this platform.
                </p>

                <div className="bg-gray-100 p-4 border-2 border-black font-mono text-sm text-left">
                    <p className="font-bold mb-2">POSSIBLE REASONS:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Spamming or Fake Listings</li>
                        <li>Inappropriate Behavior</li>
                        <li>Reports from other users</li>
                    </ul>
                </div>

                <div className="mt-8">
                    <a href="mailto:dhruvbansal.mait@gmail.com" className="text-sm font-mono underline hover:text-red-600">
                        Think this is a mistake? Contact Support.
                    </a>
                </div>
            </div>
        </main>
    );
}