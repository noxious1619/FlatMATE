import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, userId, message } = body; // userId here is the SENDER

    // 1. First, find the listing to know who the OWNER (Receiver) is
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    // 2. Create the ConnectionRequest using your specific schema fields
    const newRequest = await prisma.connectionRequest.create({
      data: {
        senderId: userId,           // The person sending the request
        receiverId: listing.ownerId,// The owner of the listing
        listingId: listingId,
        message: message,           // The new field we added
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });

  } catch (error: any) { // Type as any to catch Prisma errors safely
    console.error("Error creating request:", error);

    // Handle the "Unique constraint" error (User already requested this listing)
    if (error.code === 'P2002') {
       return NextResponse.json(
        { success: false, error: "You have already sent a request for this listing." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to send request" },
      { status: 500 }
    );
  }
}