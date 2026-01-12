import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const colleges = await prisma.college.findMany({
    select: {
      id: true,
      name: true,
      city: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(colleges);
}
