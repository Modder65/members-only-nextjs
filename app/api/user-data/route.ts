import { currentUser } from "@/lib/auth";
import { Friendship, User } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const loggedInUser = await currentUser();

    const userData: User = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userFriendships: {
          where: { status: 'ACCEPTED' },
          include: {
            friend: { select: { id: true, name: true, image: true } }
          }
        },
        friendUserFriendships: {
          where: { status: 'ACCEPTED' },
          include: {
            user: { select: { id: true, name: true, image: true } }
          }
        }
      }
    });

    // Check the friendship status between logged-in user and profile user
    let friendshipStatus = null;
    const friendship: Friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: loggedInUser.id, receiverId: userId },
          { senderId: userId, receiverId: loggedInUser.id }
        ]
      }
    });

    if (friendship) {
      friendshipStatus = friendship.status;
    }

    return NextResponse.json({userData, friendshipStatus}, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
