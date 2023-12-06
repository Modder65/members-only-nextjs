import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static by default

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    // Fetch replies for a specified comment
    const replies = await prisma.reply.findMany({
      where: {
        commentId: commentId // Filter replies by comment ID
      },
      include: {
        user: {
          select: { name: true } // Include the name of the user who made the comment
        }
      }
    })

    return NextResponse.json(replies, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}