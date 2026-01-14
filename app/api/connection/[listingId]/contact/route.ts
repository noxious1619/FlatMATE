// securely returns contact details (phone & email) of the other party in a listing only after a connection request has been ACCEPTED.

import { NextResponse, NextRequest  } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ listingId: string }> }
  
) {
  const { listingId } = await context.params;
  // 1. Auth
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. Find ACCEPTED connection
  const connection = await prisma.connectionRequest.findFirst({
    where: {
      listingId,
      status: "ACCEPTED",
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!connection) {
    return NextResponse.json(
      { error: "No accepted connection" },
      { status: 403 }
    );
  }

  // 3. Return OTHER user's contact
  const contactUser =
    connection.senderId === userId
      ? connection.receiver
      : connection.sender;

  return NextResponse.json({
    phone: contactUser.phoneNumber,
    email: contactUser.email,
  });
}
