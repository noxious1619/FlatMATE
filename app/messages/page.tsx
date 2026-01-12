// app/owner/requests/page.tsx
import prisma from "@/app/lib/prisma";
import RequestList from "../components/RequestList";

export const dynamic = "force-dynamic";

export default async function OwnerRequestsPage() {
  const currentUserId = "fec254af-ab3f-4fa5-85fe-ca8a39c218bc"; // Your User ID

  // Fetch only PENDING requests where the current user is the RECEIVER (Owner)
  const rawRequests = await prisma.connectionRequest.findMany({
    where: {
      receiverId: currentUserId,
      status: "PENDING", 
    },
    include: {
      sender: {
        select: { userName: true, name: true },
      },
      listing: {
        select: { title: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform data to ensure it is safe to pass to Client Component
  // (Convert Dates to strings, handle nulls)
  const requests = rawRequests.map((req) => ({
    id: req.id,
    senderName: req.sender?.userName || req.sender?.name || "Unknown User",
    listingTitle: req.listing?.title || "Unknown Listing",
    createdAt: new Date(req.createdAt).toLocaleDateString() + " at " + new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    message: req.message || undefined
  }));

  return <RequestList initialRequests={requests} />;
}