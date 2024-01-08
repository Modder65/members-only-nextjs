import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/prismadb";


export async function POST(request) {
  const { friendRequestId } = await request.json();

  try {
    await prisma.friendship.delete({
      where: { id: friendRequestId },
    });

    const pusherPayload = { friendRequestId };

    await pusherServer.trigger("friends-channel", "friend:remove", pusherPayload);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error unfriending!", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
