import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

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
    const body = await req.json();
    
    // Destructure all incoming data
    const { 
      title, 
      description, 
      price, 
      images, 
      ownerId, // IMPORTANT: Since we don't have Auth yet, frontend must send this!
      // Tags
      tag_ac, tag_cooler, tag_noBrokerage, tag_wifi, tag_cook, 
      tag_maid, tag_geyser, tag_metroNear, tag_noRestrictions 
    } = body;

    // 1. Basic Validation
    if (!title || !description || !price || !ownerId) {
      return NextResponse.json(
        { error: "Missing required fields (title, desc, price, or owner)" },
        { status: 400 }
      );
    }

    // 2. Create the Listing in Supabase
    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price), // Ensure it's a number
        images: images || [], // Default to empty array if no images
        ownerId,
        
        // Map the boolean tags directly
        tag_ac: tag_ac || false,
        tag_cooler: tag_cooler || false,
        tag_noBrokerage: tag_noBrokerage || false,
        tag_wifi: tag_wifi || false,
        tag_cook: tag_cook || false,
        tag_maid: tag_maid || false,
        tag_geyser: tag_geyser || false,
        tag_metroNear: tag_metroNear || false,
        tag_noRestrictions: tag_noRestrictions || false,
      },
    });

    return NextResponse.json(newListing, { status: 201 });

  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}