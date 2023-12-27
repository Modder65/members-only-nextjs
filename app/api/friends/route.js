import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";

export async function GET(request) {
  const session = await getSession();
  const userId = session.user.id;

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { friendId: userId, status: 'ACCEPTED' }, // Current user is the receiver
          { userId: userId, status: 'ACCEPTED' }   // Current user is the sender
        ]
      },
      include: {
        user: true,  // Includes details of the user who sent the request
        friend: true // Includes details of the friend (receiver)
      }
    });

    // Map over the friendships to return only the friend's data
    const friends = friendships.map(friendship => {
      return userId === friendship.userId ? friendship.friend : friendship.user;
    });

    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
