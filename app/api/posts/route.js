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
    const posts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        _count: { select: { comments: true, likes: true } },
        likes: {
          where: { userId: userId },
          select: { id: true }
        }
      }
    });

    // Add the currentUserLiked field
    const modifiedPosts = posts.map(post => ({
      ...post,
      currentUserLiked: post.likes.some(like => like.userId === userId)
    }));

    return NextResponse.json(modifiedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}