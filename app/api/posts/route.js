import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const user = await currentUser();
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const sortOrder = searchParams.get("sortOrder") || "desc"; // Default to descending
    const userName = searchParams.get("userName"); // Extract username from query params
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = page * limit;

    // Construct the query conditionally based on whether a username is provided
    const queryOptions = {
      take: limit,
      skip: skip,
      orderBy: { createdAt: sortOrder },
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
        likes: true,
      },
    };

    // Add a where clause if userName is provided
    if (userName) {
      queryOptions.where = {
        user: {
          name: {
            equals: userName,
            mode: 'insensitive', // Optional: case-insensitive search
          }
        }
      };
    }

    // Fetch posts based on the constructed query
    const posts = await prisma.post.findMany(queryOptions);

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