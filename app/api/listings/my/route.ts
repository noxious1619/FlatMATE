import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getTestUser } from "@/app/lib/mockAuth"; //later 

export async function GET() {
  try {
     const user = getTestUser();

    const listings = await prisma.listing.findMany({
      where: {
        ownerId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch your listings" },
      { status: 500 }
    );
  }
}
