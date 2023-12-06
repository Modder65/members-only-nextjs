import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";

export async function POST(request) {
  const session = await getSession();
  const userId = session.user.id;
  const { title, message } = await request.json();

  try {
    const post = await prisma.post.create({
      data: {
        title, 
        message, 
        user: { connect: { id: userId } },
      }
    });

    /*
    await pusherServer.trigger("posts-channel", "new-post", {
      _id: post.id, // Note: Prisma uses 'id' by default instead of '_id'
      title: post.title,
      message: post.message,
      user: userId,
      createdAt: post.createdAt
    });
    */

    return NextResponse.json({ message: "Post created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}