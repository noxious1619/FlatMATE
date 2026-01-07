import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getTestUser } from "@/app/lib/mockAuth"; // from phase 2 (dhruv)

// ============================================================================
// 1. GET: FETCH ALL LISTINGS (For the Feed)
// ============================================================================
export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        isAvailable: true, // Only show available flats
      },
      orderBy: {
        createdAt: 'desc', // Newest first
      },
      include: {
        owner: { // Join with User table to get owner details
          select: {
            name: true,
            profileImage: true,
            college: true,
            isVerified: true,
          }
        }
      }
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}

// ============================================================================
// 2. POST: CREATE A NEW LISTING
// ============================================================================

export async function POST(req: Request) {
  
  try {

    // change later with auth
    const user = getTestUser();


    // 2. Digital Gatekeeper
    if (!user.isVerified || user.isBlacklisted) {
      return NextResponse.json(
        { error: "User not verified or blacklisted" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Destructure all incoming data
    let {
      title,
      description,
      price,
      images,
      // Tags
      tag_ac, tag_cooler, tag_noBrokerage, tag_wifi, tag_cook,
      tag_maid, tag_geyser, tag_metroNear, tag_noRestrictions
    } = body;

    // 1. Basic Validation
    if (!title || !description || !price) {
      return NextResponse.json(
        { error: "Missing required fields (title, desc or price)" },
        { status: 400 }
      );
    }

    title = title.trim();
    description = description.trim();

    // Ensure price is a number
    price = Number(price);

    // Ensure images is an array
    images = Array.isArray(images) ? images : [];

    console.log("Creating listing with:", {
      title,
      description,
      price,
      images
    });


    // 2. Create the Listing in Supabase
    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price), // Ensure it's a number
        images: images || [], // Default to empty array if no images
        ownerId: user.id, // from AUTH

        // Map the boolean tags directly
        tag_ac: !!tag_ac,
        tag_cooler: !!tag_cooler,
        tag_noBrokerage: !!tag_noBrokerage,
        tag_wifi: !!tag_wifi,
        tag_cook: !!tag_cook,
        tag_maid: !!tag_maid,
        tag_geyser: !!tag_geyser,
        tag_metroNear: !!tag_metroNear,
        tag_noRestrictions: !!tag_noRestrictions,
      },
    });

    return NextResponse.json(newListing, { status: 201 });

  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}