import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, fullName, college, phone } = body;

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or enrollment number already exists." },
                { status: 409 }
            );
        }

        // 2. Hash Password
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Create User
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name: fullName,
                college,
                phoneNumber: phone,
            },
        });

        // Exclude passwordHash from response
        const { passwordHash: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
