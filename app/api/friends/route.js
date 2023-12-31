import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/prismadb";

export async function GET(request) {
  const session = await auth();
  const userId = session.user.id;

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { receiverId: userId, status: 'ACCEPTED' }, // Current user is the receiver
          { senderId: userId, status: 'ACCEPTED' }   // Current user is the sender
        ]
      },
      include: {
        user: true,  // Includes details of the user who sent the request
        friend: true // Includes details of the friend (receiver)
      }
    });

    return NextResponse.json(friendships, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
