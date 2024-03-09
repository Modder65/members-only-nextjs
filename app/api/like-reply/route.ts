import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await currentUser();
  const userId = user.id;
  const { replyId } = await request.json() as { replyId: string };

  try {
    let currentUserLiked = false;

    // Check if like already exists for the reply
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        replyId,
      },
    });

    if (existingLike == null) {
      // User hasn't liked the reply, create a new like
      await prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          Reply: { connect: { id: replyId } }, 
        },
      });
      currentUserLiked = true; // User liked the reply
    } else {
      // User has already liked the reply, remove their original like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      currentUserLiked = false; // User unliked the reply
    }

    // Get updated like count
    const updatedLikeCount: number = await prisma.like.count({
      where: { replyId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "like:reply", {
      replyId,
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
