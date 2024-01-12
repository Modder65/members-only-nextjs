import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function GET(request) {
  const user = await currentUser();

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { receiverId: user.id, status: 'ACCEPTED' }, // Current user is the receiver
          { senderId: user.id, status: 'ACCEPTED' }   // Current user is the sender
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
