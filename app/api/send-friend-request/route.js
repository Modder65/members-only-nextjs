import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";

export async function POST(request) {
  const session = await getSession();
  const userId = session.user.id;
  const { friendId } = await request.json();

  // Prevent sending a friend request to oneself
  if (userId === friendId) {
    return NextResponse.json({ error: "Cannot send friend request to oneself" }, { status: 400 });
  }

  try {
    // Check if a friendship already exists
    // Check if a friendship already exists
    const existingFriendship = await prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: userId,
          friendId: friendId,
        },
      },
    });

    // Check the reverse relationship as well
    const existingFriendshipReverse = await prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: friendId,
          friendId: userId,
        },
      },
    });

    if (existingFriendship || existingFriendshipReverse) {
      return NextResponse.json({ error: "Friend request already exists or friendship already established" }, { status: 400 });
    }

    // Create a new friend request
    const newFriendship = await prisma.friendship.create({
      data: {
        userId,
        friendId,
        status: 'PENDING',
      },
    });
    
    //await pusherServer.trigger("comments-channel", "comment:created", newComment);

    return NextResponse.json(newFriendship, { message: "Friend request sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

 