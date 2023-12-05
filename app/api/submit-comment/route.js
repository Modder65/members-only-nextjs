import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";

export async function POST(request) {
  const session = await getSession();
  const userId = session.user.id;
  const { message, postId } = await request.json();
  

  try {
    const comment = await prisma.comment.create({
      data: {
        message, 
        user: { connect: { id: userId } },
        post: { connect: { id: postId }}
      }
    });

    /*
    await pusherServer.trigger("posts-channel", "new-comment", {
      _id: comment.id, // Note: Prisma uses 'id' by default instead of '_id'
      message: comment.message,
      user: userId,
      createdAt: comment.createdAt
    });
    */

    return NextResponse.json({ message: "Comment created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

 