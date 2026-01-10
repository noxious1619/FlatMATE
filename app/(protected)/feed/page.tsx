import ListingCard from "../components/ListingCard";
import Navbar from "../../components/Navbar";
import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import DropdownFilters from "@/app/components/DropdownFilters";
import { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

// 1. Define the type to expect a Promise
type FeedPageProps = {
  searchParams: Promise<{
    category?: string;
    ac?: string;
    cooler?: string;
    noBroker?: string;
    wifi?: string;
    cook?: string;
    maid?: string;
    geyser?: string;
    metroNear?: string;
    noRules?: string;
  }>;
};

export default async function FeedPage(props: FeedPageProps) {
  // 2. Await the searchParams immediately
  const searchParams = await props.searchParams;

  // ---------- Prisma Filters ----------
  const filters: any = { isAvailable: true };
  if (searchParams.category) filters.category = searchParams.category as Category;
  if (searchParams.ac === "true") filters.tag_ac = true;
  if (searchParams.cooler === "true") filters.tag_cooler = true;
  if (searchParams.noBroker === "true") filters.tag_noBrokerage = true;
  if (searchParams.wifi === "true") filters.tag_wifi = true;
  if (searchParams.cook === "true") filters.tag_cook = true;
  if (searchParams.maid === "true") filters.tag_maid = true;
  if (searchParams.geyser === "true") filters.tag_geyser = true;
  if (searchParams.metroNear === "true") filters.tag_metroNear = true;
  if (searchParams.noRules === "true") filters.tag_noRestrictions = true;

  const rawListings = await prisma.listing.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
  });

  // console.log("rawListings:", rawListings);

  const buttonClass = (active: boolean) =>
    active
      ? "bg-black text-white border-2 border-black px-4 py-2 font-mono text-sm font-bold whitespace-nowrap"
      : "bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors whitespace-nowrap";

  // 3. Instead of passing a function to DropdownFilters, 
  // we just pass the current searchParams as an object.
  // The logic to build the URL should happen INSIDE DropdownFilters.

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <div className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-sm border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex gap-4 overflow-visible no-scrollbar">
          <button className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            <Filter size={16} /> FILTERS
          </button>

          {/* Use manual logic for the Boys/Girls links in this server component */}
          <Link href={`/feed?${new URLSearchParams({ ...searchParams, category: 'BOYS' }).toString()}`}>
            <button className={buttonClass(searchParams.category === "BOYS")}>Boys</button>
          </Link>

          <Link href={`/feed?${new URLSearchParams({ ...searchParams, category: 'GIRLS' }).toString()}`}>
            <button className={buttonClass(searchParams.category === "GIRLS")}>Girls</button>
          </Link>

          <DropdownFilters
            currentParams={searchParams}
          />

          <Link href="/feed">
            <button className="bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors">
              Clear
            </button>

          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {rawListings.length === 0 ? (
          <div className="text-center py-20 font-mono opacity-50">No listings found...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rawListings.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                id={listing.id}
                rent={listing.price.toLocaleString("en-IN")}
                location={listing.address}
                category={listing.category}
                tags={[]}
                imageUrl={listing.images[0] || "fallback_url"}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}