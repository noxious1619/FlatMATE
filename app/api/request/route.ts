import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ⚠️ Ensure this path matches your project structure

// 1. GET: Fetch Pending Requests
// Usage: GET /api/requests?userId=YOUR_USER_ID
export async function GET(req: Request) {
  try {
    // EXTRACT USER ID FROM URL (Since no session exists)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required in query params" }, { status: 400 });
    }

    const requests = await prisma.connectionRequest.findMany({
      where: {
        receiverId: userId, // Uses the URL param instead of session
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            college: true,
            emailVerified: true,
            // Still hiding sensitive info here
          },
        },
        listing: {
            select: {
                id: true,
                title: true 
            }
        }
      },
    });

    const safeData = requests.map((req) => ({
      id: req.id,
      senderId: req.sender.id,
      name: req.sender.name,
      image: req.sender.image,
      college: req.sender.college,
      isVerified: !!req.sender.emailVerified,
      message: req.message,
      listingTitle: req.listing.title
    }));

    return NextResponse.json(safeData);

  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2. PATCH: Accept/Decline
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { requestId, status } = body;

    // Validate Input
    if (!requestId || !["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // UPDATE DB (Removed ownership check for simplicity)
    const updatedRequest = await prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status: status },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            college: true,
            emailVerified: true,
            // Reveal Sensitive Info based on Status
            phoneNumber: status === "ACCEPTED", 
            email: status === "ACCEPTED",       
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      status: updatedRequest.status,
      user: {
        ...updatedRequest.sender,
        isVerified: !!updatedRequest.sender.emailVerified,
      },
    });

  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}