import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const loggedInUserId = await currentUser();

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, image: true } },
            _count: { select: { comments: true, likes: true } },
          }
        },
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
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: loggedInUserId, receiverId: userId },
          { senderId: userId, receiverId: loggedInUserId }
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
