import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";
import { Friendship, User } from "@prisma/client";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session.user.id;
  const { friendId } = await request.json() as { friendId: string };

  // Prevent sending a friend request to oneself
  if (userId === friendId) {
    return NextResponse.json({ error: "Cannot send friend request to oneself" }, { status: 400 });
  }

  try {
    // Check if a friendship already exists
    const existingFriendship: Friendship = await prisma.friendship.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: friendId,
        },
      },
    });

    // Check the reverse relationship as well
    const existingFriendshipReverse: Friendship = await prisma.friendship.findUnique({
      where: {
        senderId_receiverId: {
          senderId: friendId,
          receiverId: userId,
        },
      },
    });

    if (existingFriendship || existingFriendshipReverse) {
      return NextResponse.json({ error: "Friend request already exists or friendship already established" }, { status: 400 });
    }

    // Create a new friend request
    const newFriendship: Friendship = await prisma.friendship.create({
      data: {
        senderId: userId,
        receiverId: friendId,
        status: 'PENDING',
      },
    });
    
    // Retrieve user details of the sender
    const senderUser: User = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Ensure that you retrieve the necessary user details
    // For example, senderUser might include id, name, avatarUrl, etc.

    // Create the payload for Pusher including both friendship and user details
    const pusherPayload = {
      ...newFriendship,
      user: {
        id: senderUser.id,
        name: senderUser.name,
        // include other relevant user fields
      },
    };

    await pusherServer.trigger("friends-channel", "friend-request:created", pusherPayload);

    return NextResponse.json(newFriendship);
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
