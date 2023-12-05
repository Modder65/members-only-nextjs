import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static by default

export async function GET() {
  try {
    // Fetch posts comments and replies 
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: { name: true } // Select only the name from the user
        },
        comments: {
          include: {
            user: {
              select: { name: true }
            },
            replies: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}