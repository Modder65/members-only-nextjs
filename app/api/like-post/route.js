import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getSession from "@/app/actions/getSession";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getSession(request);
  const userId = session.user.id;
  const { postId } = await request.json();

  try {
    let currentUserLiked;
    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike == null) {
      await prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          post: { connect: { id: postId } },
        },
      });
      currentUserLiked = true;
    } else {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      currentUserLiked = false;
    }

    // Get updated like count
    const updatedLikeCount = await prisma.like.count({
      where: { postId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "post:liked", {
      postId,
      likeCount: updatedLikeCount,
      currentUserLiked: currentUserLiked,
    });

    return NextResponse.json({ message: "Like updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
