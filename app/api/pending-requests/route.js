import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request) {
  const session = await auth(); // Get the user session
  const userId = session.user.id; // The ID of the user whose pending requests we want to fetch

  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverId: userId, // Assuming 'friendId' is the user who received the request
        status: 'PENDING'
      },
      include: {
        user: true // Include user details of the one who sent the request
      }
    });

    return NextResponse.json({ requests: pendingRequests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending friend requests", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
