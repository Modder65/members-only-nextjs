import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export async function POST(request) {
  const user = await currentUser();
  const userId = user.id;
  const { postId } = await request.json();

  try {
    // Check if like already exists for the post
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (existingLike == null) {
      // User hasn't liked the post, create a new like
      await prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          Post: { connect: { id: postId } }, 
        },
      });
    } else {
      // User has already liked the post, remove their original like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    }

    // Get updated like count for the post
    const updatedLikeCount = await prisma.like.count({
      where: { postId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "like:post", {
      postId,
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
