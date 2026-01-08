import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/services/email.service";

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
                { error: "User with this email already exists." },
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


        //Send Verification Email
        console.log("Generatring token...");
        const token = crypto.randomBytes(40).toString("hex");
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
            }
        });

        try {
            console.log("Sending email to:", email);
            await sendVerificationEmail(email, token);
            console.log("Email sent successfully");
        } catch (emailError) {
            console.error("EMAIL_FAILED:", emailError);
            // throw new Error("Failed to send verification email");
        }

        return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
