import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";



export async function POST(request) {
  const session = await getSession();
  const userId = session.user.id;
  const { message, commentId } = await request.json();

  try {
    const newreply = await prisma.reply.create({
      data: {
        message, 
        user: { connect: { id: userId } },
        comment: { connect: { id: commentId }}
      },
      // Needed to match data structure of fetching replies; for pusher
      include: {
        user: {
          select: { name: true }
        }
      }
    });
   
    await pusherServer.trigger("replies-channel", "reply:created", newreply);
   
    return NextResponse.json({ message: "Reply created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}