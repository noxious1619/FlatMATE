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