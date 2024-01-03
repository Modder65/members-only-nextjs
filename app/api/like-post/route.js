import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await auth();
  const userId = session.user.id;
  const { postId } = await request.json();

  try {
    let userLikedPost = false;

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
      userLikedPost = true; // User liked the post
    } else {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      userLikedPost = false; // User unliked the post
    }

    // Get updated like count
    const updatedLikeCount = await prisma.like.count({
      where: { postId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "post:liked", {
      postId,
      likeCount: updatedLikeCount,
      actionUserId: userId, // User who performed the action
      userLikedPost // Indicates if the action was like or unlike
    });

    return NextResponse.json({ 
      message: "Like updated successfully", 
      likeCount: updatedLikeCount,
      userLikedPost: userLikedPost
  }, { status: 200 });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
