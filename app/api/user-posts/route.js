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
    // Convert page and limit to integers. Default to 0 for page and 10 for limit if not provided
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Calculate the number of posts to skip
    const skip = page * limit;
 
    // Fetch posts with pagination
    const userPosts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, image: true, id: true } },
        _count: { select: { comments: true, likes: true } },
      }
    });

     // Extract post IDs
     const postIds = userPosts.map(post => post.id);

     // Find all likes that the current user has made on these posts
    const likedPosts = await prisma.like.findMany({
      where: {
        postId: { in: postIds },
        userId: userId
      },
      select: { postId: true }
    });

    // Map these likes back to the corresponding posts
    const postsWithLikeStatus = userPosts.map(post => ({
      ...post,
      currentUserLiked: likedPosts.some(like => like.postId === post.id)
    }));

    return NextResponse.json(postsWithLikeStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}