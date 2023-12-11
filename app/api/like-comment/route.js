import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getSession from "@/app/actions/getSession";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getSession(request);
  const userId = session.user.id;
  const { commentId } = await request.json();

  try {
    let userLikedComment = false;

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike == null) {
      await prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          comment: { connect: { id: commentId } },
        },
      });
      userLikedComment = true; // User liked the comment
    } else {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      userLikedComment = false; // User unliked the comment
    }

    // Get updated like count
    const updatedLikeCount = await prisma.like.count({
      where: { commentId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "post:liked", {
      commentId,
      likeCount: updatedLikeCount,
      actionUserId: userId, // User who performed the action
      userLikedComment // Indicates if the action was like or unlike
    });

    return NextResponse.json({ 
      message: "Like updated successfully", 
      likeCount: updatedLikeCount,
      userLikedComment: userLikedComment
  }, { status: 200 });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
