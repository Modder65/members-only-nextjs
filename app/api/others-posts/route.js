import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const loggedInUser = await currentUser();

    // Convert page and limit to integers. Default to 0 for page and 10 for limit if not provided
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Calculate the number of posts to skip
    const skip = page * limit;
 
    // Fetch posts with pagination
    const othersPosts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, image: true, id: true } },
        _count: { select: { comments: true} },
        likes: true,
      }
    });

    
    const postsWithLikeStatus = othersPosts.map(post => ({
      ...post,
      currentUserLiked: post.likes.some(like => like.userId === loggedInUser.id),
      initialLikesCount: post.likes.length,
    }));

    

    return NextResponse.json(postsWithLikeStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
