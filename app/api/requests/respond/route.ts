import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getTestUser } from "@/app/lib/mockAuth";

export async function POST(req: Request) {
  try {
    // 1. AUTH CHECK
    const user = getTestUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { requestId, status } = body; 

    if (!requestId || !status) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // 2. SECURITY CHECK 
    // Ensure the logged-in user is the actual Receiver of this request
    const request = await prisma.connectionRequest.findUnique({
      where: { id: requestId },
      include: { sender: true }
    });

    if (!request) return new NextResponse("Request not found", { status: 404 });

    if (request.receiverId !== user.id) {
      return new NextResponse("You are not authorized", { status: 403 });
    }

    // 3. UPDATE STATUS
    const updatedRequest = await prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status: status }
    });

    // 4. REVEAL CONTACT INFO (Only if Accepted)
    if (status === "ACCEPTED") {
      return NextResponse.json({
        id: updatedRequest.id,
        status: "ACCEPTED",
        contactInfo: {
          phone: request.sender.phoneNumber,
          email: request.sender.email
        }
      });
    }

    return NextResponse.json({ id: updatedRequest.id, status: status });

  } catch (error) {
    console.error("[REQUEST_RESPOND_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}