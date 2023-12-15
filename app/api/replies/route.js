import prisma from "@/app/libs/prismadb";
import getSession from "@/app/actions/getSession";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static by default

export async function GET(request) {
  try {
    const session = await getSession(request);
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    // Fetch replies for a specified comment
    const replies = await prisma.reply.findMany({
      orderBy: { createdAt: 'desc' },
      where: { commentId: commentId },
      include: {
        user: { select: { name: true } },
        _count: {
          select: { likes: true } 
        }
      }
    });

    // Extract reply IDs
    const replyIds = replies.map(reply => reply.id);

    // Find all likes that the current user has made on these replies
    const likedReplies = await prisma.like.findMany({
      where: {
        replyId: { in: replyIds },
        userId: userId
      },
      select: { replyId: true }
    });

    // Map these likes back to the corresponding replies
    const repliesWithLikeStatus = replies.map(reply => ({
      ...reply,
      currentUserLiked: likedReplies.some(like => like.replyId === reply.id)
    }));

    return NextResponse.json(repliesWithLikeStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}