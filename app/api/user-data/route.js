import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const loggedInUser = await currentUser();

    const userData = await prisma.user.findUnique({
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
    const friendship = await prisma.friendship.findFirst({
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
