import Navbar from "@/app/components/Navbar";
import { ArrowLeft, MapPin, IndianRupee, ShieldCheck, User, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { getTestUser } from "@/app/lib/mockAuth"; 
import ListingInteraction from "@/app/(protected)/components/ListingInteraction"; 
import ShareListing from "@/app/(protected)/components/ShareListing"; 

// Helper to format currency
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price);
};

// 1. UPDATE TYPE DEFINITION HERE
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetails(props: Props) {
    // 2. AWAIT PARAMS HERE
    const params = await props.params;
    const { id } = params;
    
    // 3. Get Current User
    const user = getTestUser();
    const currentUserId = user ? user.id : "";

    if (!id) {
        notFound();
    }

    // 4. Fetch Listing & Owner
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    college: true,
                    image: true,
                    emailVerified: true,
                    email: true, 
                    phoneNumber: true 
                }
            }
        }
    });

    if (!listing) {
        notFound();
    }

    // 5. Check Connection Status
    let requestStatus = null; 
    let contactDetails = null;

    if (user) {
        const connection = await prisma.connectionRequest.findUnique({
            where: {
                senderId_listingId: {
                    senderId: user.id,
                    listingId: listing.id
                }
            }
        });

        if (connection) {
            requestStatus = connection.status; 
            
            if (connection.status === "ACCEPTED") {
                contactDetails = {
                    phone: listing.owner.phoneNumber,
                    email: listing.owner.email
                };
            }
        }
    }

    // Convert boolean tags to array
    const tags = [];
    if (listing.tag_ac) tags.push("AC");
    if (listing.tag_cooler) tags.push("Cooler");
    if (listing.tag_noBrokerage) tags.push("No Brokerage");
    if (listing.tag_wifi) tags.push("Wifi Included");
    if (listing.tag_cook) tags.push("Cook Available");
    if (listing.tag_maid) tags.push("Maid Available");
    if (listing.tag_geyser) tags.push("Geyser");
    if (listing.tag_metroNear) tags.push("Near Metro");
    if (listing.tag_noRestrictions) tags.push("No Restrictions");

    const isVerified = !!listing.owner.emailVerified;
    const ownerImage = listing.owner.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.owner.name || 'User'}`;

    return (
        <main className="min-h-screen bg-brand-bg pb-32">
            <Navbar />

            <div className="max-w-4xl mx-auto p-4">

                {/* BACK BUTTON */}
                <Link href="/feed" className="inline-flex items-center gap-2 font-mono font-bold mb-6 hover:underline">
                    <ArrowLeft size={20} /> BACK
                </Link>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: IMAGES & INFO */}
                    <div className="md:col-span-2 space-y-6">

                        {/* HERO IMAGE */}
                        <div className="bg-white p-2 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                            <img
                                src={listing.images[0] || "/placeholder.png"}
                                alt="Room Main"
                                className="w-full h-64 md:h-96 object-cover border-2 border-black"
                            />
                        </div>

                        {/* TITLE & PRICE */}
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="font-heavy text-3xl md:text-5xl uppercase leading-none mb-2">
                                    {listing.title}
                                </h1>
                                <div className="flex gap-2">
                                    {/* <button className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Share2 size={20} />
                                    </button> */}
                                    <ShareListing />
                                    <button className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Bookmark size={20}  />
                                    </button>
                                </div>
                            </div>

                            {listing.address && (
                            <div className="flex flex-col items-start gap-2 font-mono text-gray-600 mb-4">
                                <div className="flex mt-2 mb-5 items-center text-xl">
                                    <MapPin size={25} className="mr-2 text-black"/>
                                    <p>{listing.address}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-black border-2 border-black px-3 py-1 bg-brand-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <User size={18} />
                                    <span>{listing.category}</span>
                                </div>                                
                            </div>
                            )}

                            <div className="flex gap-4 mb-6">
                                <div className="bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="block font-mono text-xs text-gray-500">RENT</span>
                                    <span className="font-heavy text-xl flex items-center">
                                        <IndianRupee size={20} strokeWidth={3} />{formatPrice(listing.price)}
                                    </span>
                                </div>
                                {listing.deposit && (
                                    <div className="bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-80">
                                        <span className="block font-mono text-xs text-gray-500">DEPOSIT</span>
                                        <span className="font-heavy text-xl flex items-center">
                                            <IndianRupee size={16} strokeWidth={3} />{formatPrice(listing.deposit)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* VIBE TAGS */}
                        <div>
                            <h3 className="font-heavy text-xl mb-3 uppercase border-b-2 border-black inline-block">The Vibe</h3>
                            <div className="flex flex-wrap gap-3">
                                {tags.length > 0 ? tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 font-mono font-bold border-2 border-black bg-white rounded-full text-sm">
                                        {tag}
                                    </span>
                                )) : <span className="text-gray-500 font-mono text-sm">No specific tags.</span>}
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="bg-white border-2 border-black p-6 shadow-retro relative mt-8">
                            <div className="absolute -top-3 -right-3 bg-brand-yellow px-2 py-1 border-2 border-black font-mono text-xs font-bold rotate-3">
                                READ ME
                            </div>
                            <p className="font-mono leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                {listing.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LISTER PROFILE (Sticky) */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white border-2 border-black p-6 shadow-retro text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full border-2 border-black mx-auto mb-4 overflow-hidden">
                                    <img src={ownerImage} alt="Avatar" className="w-full h-full object-cover" />
                                </div>

                                <h3 className="font-heavy text-xl">{listing.owner.name || "Anonymous"}</h3>
                                <p className="font-mono text-sm text-gray-500 mb-2">{listing.owner.college || "Student"}</p>

                                {isVerified && (
                                    <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-xs mb-6">
                                        <ShieldCheck size={14} /> VERIFIED STUDENT
                                    </div>
                                )}

                                {/* --- INTERACTIVE BUTTONS COMPONENT --- */}
                                <ListingInteraction 
                                    listingId={listing.id}
                                    ownerId={listing.owner.id}
                                    currentUserId={currentUserId}
                                    initialStatus={requestStatus}
                                    ownerName={listing.owner.name || "User"}
                                    contactDetails={contactDetails}
                                />
                                {/* ----------------------------------- */}

                                <p className="text-[10px] font-mono text-gray-400 mt-2">
                                    {requestStatus === "ACCEPTED" 
                                        ? "Details revealed!" 
                                        : "Identity hidden until you match."}
                                </p>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <Link href={`/users/${listing.owner.id}`} className="text-xs font-mono font-bold underline">
                                        View Full Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}