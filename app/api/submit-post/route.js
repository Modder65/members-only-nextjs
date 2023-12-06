import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";

export async function POST(request) {
  const session = await getSession();
  const userId = session.user.id;
  const { title, message } = await request.json();

  try {
    /*
    const newPost = await prisma.post.create({
      data: {
        title, 
        message, 
        user: { connect: { id: userId } }
      }
    });
    */

    const newPost = await prisma.post.create({
      data: {
        title,
        message,
        user: { connect: { id: userId }}
      },
      // Needed to match data structure of fetching posts; for pusher
      include: {
        user: { select: { name: true } },
        _count: {
          select: { comments: true }
        }
      }
    });

    await pusherServer.trigger("posts-channel", "post:created", newPost);
    
    return NextResponse.json({ message: "Post created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}