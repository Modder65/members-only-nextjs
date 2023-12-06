import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";

export async function POST(request) {
  const session = await getSession();
  const userId = session.user.id;
  const { message, postId } = await request.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        message, 
        user: { connect: { id: userId } },
        post: { connect: { id: postId }}
      },
      // Needed to match data structure of fetching posts; for pusher
      include: {
        user: { select: { name: true }},
        _count: {
          select: { replies: true }
        }
      }
    });

    const updatedCommentCount = await prisma.comment.count({
      where: { postId: newComment.postId },
    });

    await pusherServer.trigger("comments-channel", "comment:created", {
      postId: newComment.postId,
      updatedCommentCount
    });

    return NextResponse.json({ message: "Comment created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

 