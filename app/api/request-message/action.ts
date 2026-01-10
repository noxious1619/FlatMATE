// app/owner/requests/actions.ts
"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function handleRequestResponse(requestId: string, action: "ACCEPT" | "IGNORE") {
  try {
    const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    await prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
    });

    // Refresh the page so data is accurate next time
    revalidatePath("/owner/requests"); 
    return { success: true };
  } catch (error) {
    console.error("Error updating request:", error);
    return { success: false, error: "Failed to update request." };
  }
}