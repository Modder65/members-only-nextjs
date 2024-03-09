import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { CommentWithLikes, ExtendedComment } from "@/types/types";
import { Like } from "@prisma/client";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static by default

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    const userId = user.id;
    
    const { searchParams } = new URL(request.url);
    const postId: string = searchParams.get("postId");
  

    // Fetch comments or a specified post
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      where: { postId: postId },
      include: {
        user: { select: { name: true } },
        _count: { select: { replies: true } },
        likes: true,
      }
    });

    // Map these likes back to the corresponding comments
    const commentsWithLikeStatus: CommentWithLikes[] = comments.map((comment: CommentWithLikes) => ({
      ...comment,
      currentUserLiked: comment.likes.some((like: Like) => like.userId === userId), // Check if user liked the post
      initialLikesCount: comment.likes.length, // Initial like count
    }));

    return NextResponse.json(commentsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}