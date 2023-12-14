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
    const postId = searchParams.get("postId");
  

    // Fetch comments or a specified post
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      where: { postId: postId },
      include: {
        user: { select: { name: true } },
        _count: {
          select: { replies: true, likes: true } // This counts the number of replies for each comment
        }
      }
    });

    // Extract comment IDs
    const commentIds = comments.map(comment => comment.id);

    // Find all likes that the current user has made on these comments
    const likedComments = await prisma.like.findMany({
      where: {
        commentId: { in: commentIds },
        userId: userId
      },
      select: { commentId: true }
    });

    // Map these likes back to the corresponding comments
    const commentsWithLikeStatus = comments.map(comment => ({
      ...comment,
      currentUserLiked: likedComments.some(like => like.commentId === comment.id)
    }));

    return NextResponse.json(commentsWithLikeStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}