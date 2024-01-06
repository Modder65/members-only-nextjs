import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/prismadb";


export async function POST(request) {
  const { friendRequestId } = await request.json();

  try {
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendRequestId },
      data: { status: 'ACCEPTED' },
    });

    // Fetch additional details as needed (e.g., user names, profile pictures)
    const sender = await prisma.user.findUnique({ where: { id: updatedFriendship.senderId } });
    const receiver = await prisma.user.findUnique({ where: { id: updatedFriendship.receiverId } });

    // Include both users' details in the Pusher event data
    const pusherPayload = {
      ...updatedFriendship,
      sender: { id: sender.id, name: sender.name, /* other details */ },
      receiver: { id: receiver.id, name: receiver.name, /* other details */ }
    };

    await pusherServer.trigger("friends-channel", "friend-request:accepted", pusherPayload);

    return NextResponse.json(updatedFriendship, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending friend requests", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
