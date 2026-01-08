import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const email = request.nextUrl.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json(
      { error: "Missing token or email" },
      { status: 400 }
    );
  }

  try {
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        identifier: email, // The schema uses 'identifier' for the email
      },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const now = new Date();
    if (existingToken.expires < now) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.update({
      where: { email: email },
      data: {
        emailVerified: new Date(),
      },
    });

    // Clean up used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
