import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Make sure this path matches where you put the file in Step 1

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userName, name, phoneNumber } = body;

    if (!email || !userName || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. MAIT Verification Logic (The "Valid8" Logic)
    // Checking if enrollment number contains college codes 148 or 964
    // Assumption: The username MIGHT be the enrollment number, or we check email.
    // Let's assume for now we trust the input, but mark verified if valid.
    
    let isVerified = false;
    if (userName.includes("148") || userName.includes("964") || email.endsWith("mait.ac.in")) {
      isVerified = true;
    }

    // 3. Create User in Database
    const newUser = await prisma.user.create({
      data: {
        email,
        userName,
        name,
        phoneNumber: String(phoneNumber), // Ensure string
        isVerified, // Auto-verify if logic passes
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error);

    // Handle Duplicate User Error (Prisma P2002)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "User with this email or username already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}