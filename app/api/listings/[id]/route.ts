import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET: Fetch single listing (for Edit page mainly)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);

  } catch (error) {
    console.error("GET LISTING ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}

// PATCH: Update Listing
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Verify ownership
    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { ownerId: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        deposit: Number(body.deposit),
        address: body.address,
        // tags
        tag_ac: body.tag_ac,
        tag_cooler: body.tag_cooler,
        tag_noBrokerage: body.tag_noBrokerage,
        tag_wifi: body.tag_wifi,
        tag_cook: body.tag_cook,
        tag_maid: body.tag_maid,
        tag_geyser: body.tag_geyser,
        tag_metroNear: body.tag_metroNear,
        tag_noRestrictions: body.tag_noRestrictions,
        // images
        images: body.images
      }
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("PATCH LISTING ERROR", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (listing.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this listing" },
        { status: 403 }
      );
    }

    // 2️⃣ Soft delete (mark as unavailable) OR Real delete?
    // Profile page calls DELETE to "Mark as filled". 
    // Usually "Filled" means isAvailable = false.
    // "Delete" means remove row.
    // The previous implementation did Soft Delete (isAvailable: false).
    // I will stick to that behavior but maybe rename logic in UI to "Mark Filled"

    const updated = await prisma.listing.update({
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
