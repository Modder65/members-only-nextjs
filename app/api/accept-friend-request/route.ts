import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const { friendRequestId } = await request.json();

  try {
    // Update the friendship status
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendRequestId },
      data: { status: 'ACCEPTED' },
    });

    // Fetch the complete friendship data with user and friend details
    const completeFriendship = await prisma.friendship.findUnique({
      where: { id: friendRequestId },
      include: {
        user: true, // User who sent the request
        friend: true // Friend who received the request
      }
    })

    // Construct the payload for Pusher
    const pusherPayload = {
      ...completeFriendship,
      user: { 
        id: completeFriendship.user.id,
        name: completeFriendship.user.name,
        // Include other necessary user fields
      },
      friend: { 
        id: completeFriendship.friend.id,
        name: completeFriendship.friend.name,
        // Include other necessary friend fields
      },
    };

    await pusherServer.trigger("friends-channel", "friend-request:accepted", pusherPayload);

    return NextResponse.json(updatedFriendship, { status: 200 });
  } catch (error) {
    console.error("Error processing friend request", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
