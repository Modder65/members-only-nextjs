import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static by default

export async function GET(request) {
  try {
    const user = await currentUser();
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    // Fetch replies for a specified comment
    const replies = await prisma.reply.findMany({
      orderBy: { createdAt: 'desc' },
      where: { commentId: commentId },
      include: {
        user: { select: { name: true } },
        likes: true,
      }
    });

    // Map these likes back to the corresponding replies
    const repliesWithLikeStatus = replies.map(reply => ({
      ...reply,
      currentUserLiked: reply.likes.some(like => like.userId === userId), // Check if user liked the reply
      initialLikesCount: reply.likes.length, // Initial like count
    }));

    return NextResponse.json(repliesWithLikeStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}