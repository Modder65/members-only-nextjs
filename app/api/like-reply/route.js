import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await auth();
  const userId = session.user.id;
  const { replyId } = await request.json();

  try {
    let userLikedReply = false;

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_replyId: {
          userId,
          replyId,
        },
      },
    });

    if (existingLike == null) {
      await prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          reply: { connect: { id: replyId } },
        },
      });
      userLikedReply = true; // User liked the reply
    } else {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      userLikedReply = false; // User unliked the reply
    }

    // Get updated like count
    const updatedLikeCount = await prisma.like.count({
      where: { replyId },
    });

    // Pusher broadcast
    await pusherServer.trigger("likes-channel", "reply:liked", {
      replyId,
      likeCount: updatedLikeCount,
      actionUserId: userId, // User who performed the action
      userLikedReply // Indicates if the action was like or unlike
    });

    return NextResponse.json({ 
      message: "Like updated successfully", 
      likeCount: updatedLikeCount,
      userLikedReply: userLikedReply
  }, { status: 200 });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
