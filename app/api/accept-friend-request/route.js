import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/prismadb";

export async function POST(request) {
  const { friendRequestId, userId } = await request.json();

  try {
    // Update the friendship status
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendRequestId },
      data: { status: 'ACCEPTED' },
    });

    // Fetch the detailed user and friend data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Include additional fields as necessary
    });
    const friend = await prisma.user.findUnique({
      where: { id: updatedFriendship.senderId === userId ? updatedFriendship.receiverId : updatedFriendship.senderId },
      // Include additional fields as necessary
    });

    // Construct the payload for Pusher
    const pusherPayload = {
      friendshipId: updatedFriendship.id,
      user: userId === updatedFriendship.senderId ? user : friend,  // User who accepted the request
      friend: userId === updatedFriendship.senderId ? friend : user,  // New friend
    };

    await pusherServer.trigger("friends-channel", "friend-request:accepted", pusherPayload);

    return NextResponse.json(updatedFriendship, { status: 200 });
  } catch (error) {
    console.error("Error processing friend request", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
