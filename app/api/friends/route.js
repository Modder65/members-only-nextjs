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
          { friendId: userId, status: 'ACCEPTED' },
          { userId: userId, status: 'ACCEPTED' }
        ]
      },
      select: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            // other fields you need
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // other fields you need
          }
        }
      }
    });

    const friends = friendships.map(friendship => {
      // If the current user is the sender, return the receiver
      // Otherwise, return the sender
      return userId === friendship.userId ? friendship.friend : friendship.user;
    });

    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
