import Navbar from "../../components/Navbar";
import { ListingCategory, SharingType, FurnishedStatus, GenderPreference } from "@prisma/client";
import prisma from "@/app/lib/prisma";
import FeedClient from "./FeedClient";
import FeedSidebar from "./FeedSidebar";
import FeedLayout from "./FeedLayout";
import PaginationControls from "./PaginationControls";

export const dynamic = "force-dynamic";

type FeedPageProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sharing?: string;
    furnished?: string;
    gender?: string;
    ac?: string;
    cooler?: string;
    noBroker?: string;
    wifi?: string;
    cook?: string;
    maid?: string;
    geyser?: string;
    metroNear?: string;
    noRules?: string;
    college?: string;
    page?: string;
  }>;
};

export default async function FeedPage(props: FeedPageProps) {
  const searchParams = await props.searchParams;

  // ---------- Pagination ----------
  const page = Number(searchParams.page) || 1;
  const limit = 8;
  const skip = (page - 1) * limit;

  // ---------- Prisma Filters ----------
  const filters: any = { isAvailable: true };

  // 1. Text Search (Location)
  if (searchParams.query) {
    filters.location = {
      displayAddress: {
        contains: searchParams.query,
        mode: 'insensitive'
      }
    };
  }

  // 1.5 College Search
  if (searchParams.college) {
    filters.collegeDetails = {
      name: {
        contains: searchParams.college,
        mode: 'insensitive'
      }
    };
  }

  // 2. Enums
  if (searchParams.category) filters.category = searchParams.category as ListingCategory;
  if (searchParams.sharing) filters.sharingType = searchParams.sharing as SharingType;
  if (searchParams.furnished) filters.furnishedStatus = searchParams.furnished as FurnishedStatus;
  if (searchParams.gender) filters.genderPreference = searchParams.gender as GenderPreference;

  // 3. Price Range
  if (searchParams.minPrice || searchParams.maxPrice) {
    filters.price = {};
    if (searchParams.minPrice) filters.price.gte = Number(searchParams.minPrice);
    if (searchParams.maxPrice) filters.price.lte = Number(searchParams.maxPrice);
  }

  // 4. Boolean Tags
  if (searchParams.ac === "true") filters.tag_ac = true;
  if (searchParams.cooler === "true") filters.tag_cooler = true;
  if (searchParams.noBroker === "true") filters.tag_noBrokerage = true;
  if (searchParams.wifi === "true") filters.tag_wifi = true;
  if (searchParams.cook === "true") filters.tag_cook = true;
  if (searchParams.maid === "true") filters.tag_maid = true;
  if (searchParams.geyser === "true") filters.tag_geyser = true;
  if (searchParams.metroNear === "true") filters.tag_metroNear = true;
  if (searchParams.noRules === "true") filters.tag_noRestrictions = true;

  // Execute query with pagination using transaction
  const [totalCount, rawListings] = await prisma.$transaction([
    prisma.listing.count({ where: filters }),
    prisma.listing.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        location: true
      },
      skip,
      take: limit,
    })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <FeedLayout sidebar={<FeedSidebar />}>
        <FeedClient listings={rawListings} />
        <PaginationControls currentPage={page} totalPages={totalPages} />
      </FeedLayout>

    </main>
  );
}