import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";



export async function POST(request) {
  const session = await getSession();
  const userId = session.user.id;
  const { message, commentId } = await request.json();

  try {
    const reply = await prisma.reply.create({
      data: {
        message, 
        user: { connect: { id: userId } },
        comment: { connect: { id: commentId }}
      }
    });
   

    /*
    await pusherServer.trigger("posts-channel", "new-reply", {
      _id: newReply._id,
      message: newReply.message,
      comment: newReply.comment,
      user: newReply.user,
      createdAt: newReply.createdAt
    })
    */

    return NextResponse.json({ message: "Reply created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}