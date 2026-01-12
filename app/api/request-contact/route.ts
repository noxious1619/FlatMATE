import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId, listingId } = body;

    // 1. Validate Input
    if (!senderId || !listingId) {
      return NextResponse.json({ error: "Missing senderId or listingId" }, { status: 400 });
    }

    // 2. Find the Listing to get the Owner (Receiver)
    const listingData = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { ownerId: true } // <--- FIXED: changed from userId to ownerId
    });

    if (!listingData) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const receiverId = listingData.ownerId; // <--- FIXED: accessing ownerId

    // 3. Rule: Prevent Self-Requests
    if (senderId === receiverId) {
      return NextResponse.json(
        { error: "You cannot request your own listing." },
        { status: 400 }
      );
    }

    // 4. Rule: Check for Duplicates
    const existing = await prisma.connectionRequest.findFirst({
      where: {
        senderId: senderId,
        listingId: listingId
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Request already sent." },
        { status: 409 }
      );
    }

    // 5. Create the Request
    const newRequest = await prisma.connectionRequest.create({
      data: {
        status: "PENDING",
        sender: {
          connect: { id: senderId }
        },
        listing: {
          connect: { id: listingId }
        },
        receiver: {
          connect: { id: receiverId }
        }
      }
    });

    return NextResponse.json(newRequest, { status: 201 });

  } catch (error) {
    console.error("Request API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import  prisma  from "@/app/lib/prisma"; // Assuming you have a prisma db instance exported
import { getServerSession } from "next-auth"; // Or your specific auth method
import { getTestUser } from "@/app/lib/mockAuth";

export async function POST(req: Request) {
  try {
    // 1. AUTH CHECK
    const user = getTestUser(); 
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) return new NextResponse("Listing ID Missing", { status: 400 });

    // 2. EXISTENCE CHECK
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, ownerId: true } 
    });

    if (!listing) return new NextResponse("Listing not found", { status: 404 });

    // 3. SELF-REQUEST GUARD
    if (listing.ownerId === user.id) {
      console.log("⛔ [Guard] Blocked: Self-request.");
      return new NextResponse("You cannot request your own listing", { status: 400 });
    }

    // 4. DUPLICATE GUARD (Test 4)
    // We check if a request already exists using the composite key
    const existingRequest = await prisma.connectionRequest.findUnique({
      where: {
        senderId_listingId: {
          senderId: user.id,
          listingId: listingId,
        }
      }
    });

    if (existingRequest) {
      console.log("⛔ [Guard] Blocked: Duplicate request.");
      return new NextResponse("Request already sent", { status: 409 });
    }

    // 5. CREATE THE REQUEST (Test 5)
    console.log("🚀 Creating new connection request...");
    
    const newRequest = await prisma.connectionRequest.create({
      data: {
        senderId: user.id,
        listingId: listingId,
        receiverId: listing.ownerId, // Linking to the Owner
        status: "PENDING"
      }
    });

    console.log("✅ [Success] Request Created! ID:", newRequest.id);
    return NextResponse.json(newRequest);

  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}