import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  const user = await currentUser();

  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverId: user.id, 
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
