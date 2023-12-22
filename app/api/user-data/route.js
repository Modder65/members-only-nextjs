import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Fetch user data and their posts
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: { // Assuming 'posts' is the field name in your Prisma schema
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, image: true } },
            _count: { select: { comments: true, likes: true } },
          }
        },
      }
    });

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}