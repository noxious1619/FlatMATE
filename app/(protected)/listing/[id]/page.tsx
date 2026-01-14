import Navbar from "@/app/components/Navbar";
import { ArrowLeft, MapPin, IndianRupee, ShieldCheck, User, Bookmark } from "lucide-react";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { getTestUser } from "@/app/lib/mockAuth";
import ListingInteraction from "@/app/(protected)/components/ListingInteraction";
import ShareListing from "@/app/(protected)/components/ShareListing";
import LocationMap from "@/app/(protected)/components/DynamicLocationMap";

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN").format(price);
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetails(props: Props) {
  const params = await props.params;
  const { id } = params;

  const user = getTestUser();
  const currentUserId = user?.id ?? "";

  if (!id) notFound();

  // 1️⃣ Fetch Listing (Owner contact STILL fetched here, but NOT sent to client)
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
        },
      },
      location: true,
      collegeDetails: true,
    },
  });


  if (!listing) notFound();

  // 2️⃣ ONLY fetch request STATUS (no contact)
  let requestStatus: string | null = null;

  if (user) {
    const connection = await prisma.connectionRequest.findUnique({
      where: {
        senderId_listingId: {
          senderId: user.id,
          listingId: listing.id,
        },
      },
      select: {
        status: true, 
      },
    });

    if (connection) {
      requestStatus = connection.status;
    }
  }

  // Tags
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
  const ownerImage =
    listing.owner.image ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.owner.name || "User"}`;

  return (
    <main className="min-h-screen bg-brand-bg pb-32">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <Link href="/feed" className="inline-flex items-center gap-2 font-mono font-bold mb-6 hover:underline">
          <ArrowLeft size={20} /> BACK
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          {/* LEFT */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white p-2 rotate-1 shadow-retro border-2 border-black">
              <img
                src={listing.images[0] || "/placeholder.png"}
                alt="Room"
                className="w-full h-64 md:h-96 object-cover border-2 border-black"
              />
            </div>

            <h1 className="font-heavy text-3xl md:text-5xl uppercase">{listing.title}</h1>

            <div className="flex gap-4">
              <div className="bg-white border-2 border-black px-4 py-2 shadow-retro">
                <span className="block font-mono text-xs">RENT</span>
                <span className="font-heavy text-xl flex items-center">
                  <IndianRupee size={18} /> {formatPrice(listing.price)}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-heavy text-xl uppercase mb-2">The Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 font-mono font-bold border-2 border-black bg-white rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-black p-6 shadow-retro">
              <p className="font-mono whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2">
            <div className="bg-white border-2 border-black p-6 shadow-retro text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-black overflow-hidden">
                <img src={ownerImage} alt="Owner" className="w-full h-full object-cover" />
              </div>

              <h3 className="font-heavy text-xl">{listing.owner.name}</h3>
              <p className="font-mono text-sm text-gray-500">{listing.owner.college}</p>

              {isVerified && (
                <div className="flex justify-center items-center gap-1 text-green-600 font-bold text-xs my-2">
                  <ShieldCheck size={14} /> VERIFIED STUDENT
                </div>
              )}

              {/* ✅ FIX: NO contactDetails passed */}
              <ListingInteraction
                listingId={listing.id}
                ownerId={listing.owner.id}
                currentUserId={currentUserId}
                initialStatus={requestStatus}
                ownerName={listing.owner.name || "User"}
              />

              <p className="text-[10px] font-mono text-gray-400 mt-2">
                {requestStatus === "ACCEPTED"
                  ? "Details revealed securely"
                  : "Identity hidden until you match"}
              </p>
            </div>

            {listing.location && (
              <div className="mt-6 border-2 border-black shadow-retro">
                <LocationMap
                  lat={listing.location.latitude}
                  lng={listing.location.longitude}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
