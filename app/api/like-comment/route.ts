import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { Like } from "@prisma/client";
import prisma from "@/lib/prismadb";
import { CommentWithLikes } from "@/types/types";

export async function POST(request: Request) {
  const user = await currentUser();
  const userId = user.id;
  const { commentId } = await request.json() as { commentId: string };

  try {
    let currentUserLiked = false;

    // Check if like already exists for the comment
    const existingLike: Like | null = await prisma.like.findFirst({
      where: {
        userId,
        commentId,
      },
    });

    if (existingLike == null) {
      // User hasn't liked the comment, create a new like
      await prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          Comment: { connect: { id: commentId } }, 
        },
      });
      currentUserLiked = true; // User liked the comment
    } else {
      // User has already liked the comment, remove their original like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      currentUserLiked = false; // User unliked the comment
    }

    // Get updated like count
    const updatedLikeCount: number = await prisma.like.count({
      where: { commentId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "like:comment", {
      commentId,
      likeCount: updatedLikeCount,
    });

    return NextResponse.json({ 
      message: "Like updated successfully", 
      likeCount: updatedLikeCount,
  }, { status: 200 });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
