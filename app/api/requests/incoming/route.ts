import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getTestUser } from "@/app/lib/mockAuth";

export async function GET(req: Request) {
  try {
    // 1. AUTH CHECK
    const user = getTestUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("🔍 Fetching requests for Owner ID:", user.id);

    // 2. FETCH INCOMING REQUESTS
    // We look for requests where the receiverId matches the CURRENT USER
    const requests = await prisma.connectionRequest.findMany({
      where: {
        receiverId: user.id, 
      },
      include: {
        // Get Sender Details
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            college: true,     
          }
        },
        // Get Listing Details
        listing: {
          select: {
            id: true,
            title: true,
            images: true, 
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`response requests:`, requests) ;
    return NextResponse.json(requests);

  } catch (error) {
    console.error("[INCOMING_REQUESTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}