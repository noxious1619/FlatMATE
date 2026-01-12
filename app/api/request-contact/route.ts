import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // Ensure this path is correct

export async function POST(req: Request) {
  try {
    // 1. AUTH CHECK (Secure: Get ID from session, not request body)
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = session.user.id;
    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID Missing" }, { status: 400 });
    }

    // 2. EXISTENCE CHECK (Find listing & owner)
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, ownerId: true } 
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // 3. SELF-REQUEST GUARD (Prevent messaging yourself)
    if (listing.ownerId === senderId) {
      return NextResponse.json({ error: "You cannot request your own listing" }, { status: 400 });
    }

    // 4. DUPLICATE GUARD
    // Check if a request already exists between this user and this listing
    const existingRequest = await prisma.connectionRequest.findFirst({
      where: {
         senderId: senderId,
         listingId: listingId,
      }
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Request already sent" }, { status: 409 });
    }

    // 5. CREATE THE REQUEST
    const newRequest = await prisma.connectionRequest.create({
      data: {
        senderId: senderId,
        listingId: listingId,
        receiverId: listing.ownerId, 
        status: "PENDING"
      }
    });

    return NextResponse.json(newRequest, { status: 201 });

  } catch (error) {
    console.error("Request API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}