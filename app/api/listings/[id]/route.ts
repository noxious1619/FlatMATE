import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getTestUser } from "@/app/lib/mockAuth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
     const user = getTestUser();

     console.log("DELETE listingId:", listingId);
    console.log("Mock userId:", user.id);

    // 1️⃣ Check if listing exists & belongs to user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { ownerId: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this listing" },
        { status: 403 }
      );
    }

    // 2️⃣ Soft delete
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        isAvailable: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Listing marked as filled",
    });

  } catch (error) {
    console.error("DELETE LISTING ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
