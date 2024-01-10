import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const user = await currentUser();
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = page * limit;

    // Fetch posts and their initial like counts
    const posts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
        likes: true,
      }
    });

    // Map posts to include initial like counts and statuses
    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      currentUserLiked: post.likes.some(like => like.userId === userId), // Check if user liked the post
      initialLikesCount: post.likes.length, // Initial like count
    }));

    return NextResponse.json(postsWithLikeStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
