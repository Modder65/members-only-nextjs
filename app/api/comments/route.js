import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static by default

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    // Fetch comments or a specified post
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId // Filter comments by post ID
      },
      include: {
        user: {
          select: { name: true } // Include the name of the user who made the comment
        }
      }
    })

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}