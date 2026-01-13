import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

/*  GET: FETCH LISTINGS (FEED)*/
export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        location: true,
        collegeDetails: {
          select: {
            id: true,
            name: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            emailVerified: true,
          },
        },
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}

/* =========================
   POST: CREATE LISTING
========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------- USER CHECKS ---------- */
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailVerified: true,
        isBlacklisted: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 403 }
      );
    }

    if (user.isBlacklisted) {
      return NextResponse.json(
        { error: "User is blacklisted" },
        { status: 403 }
      );
    }

    /* ---------- BODY ---------- */
    const body = await req.json();

    const {
      title,
      description,
      price,
      deposit,
      category,
      genderPreference,
      collegeId,
      location,
      images,

      // Tags
      tag_ac,
      tag_cooler,
      tag_noBrokerage,
      tag_wifi,
      tag_cook,
      tag_maid,
      tag_geyser,
      tag_metroNear,
      tag_noRestrictions,
    } = body;

    /* ---------- VALIDATION ---------- */
    if (
      !title ||
      !description ||
      !price ||
      !location?.latitude ||
      !location?.longitude
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- CREATE (TRANSACTION) ---------- */
    const listing = await prisma.$transaction(async (tx) => {
      const createdLocation = await tx.location.create({
        data: {
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
          displayAddress: location.displayAddress,
        },
      });

      return tx.listing.create({
        data: {
          title: title.trim(),
          description: description.trim(),

          price: Number(price),
          deposit: deposit ? Number(deposit) : null,

          category,
          genderPreference,

          images: Array.isArray(images) ? images : [],

          ownerId: session.user.id,
          locationId: createdLocation.id,
          collegeId: collegeId || null,

          isAvailable: true,

          // Tags
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
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
