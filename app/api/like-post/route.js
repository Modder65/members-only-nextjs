import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export async function POST(request) {
  const user = await currentUser();
  const userId = user.id;
  const { postId } = await request.json();

  try {
    let currentUserLiked = false;

    // Check if like already exists for the post
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    console.log("Existing Like:", existingLike);

    if (existingLike == null) {
      // User hasn't liked the post, create a new like
      await prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          Post: { connect: { id: postId } }, // Corrected field name to "Post"
        },
      });
      currentUserLiked = true; // User liked the post
    } else {
      console.log("Deleting existing like");
      // User has already liked the post, remove their original like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      currentUserLiked = false; // User unliked the post
    }

    // Get updated like count for the post
    const updatedLikeCount = await prisma.like.count({
      where: { postId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "post:liked", {
      postId,
      likeCount: updatedLikeCount,
      actionUserId: userId, // User who performed the action
      currentUserLiked // Indicates if the action was like or unlike
    });

    return NextResponse.json({ 
      message: "Like updated successfully", 
      likeCount: updatedLikeCount,
      currentUserLiked
  }, { status: 200 });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
