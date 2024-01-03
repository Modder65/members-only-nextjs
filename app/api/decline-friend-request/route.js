import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";


export async function POST(request) {
  const { friendRequestId } = await request.json();

  try {
    await prisma.friendship.delete({
      where: { id: friendRequestId },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error fetching pending friend requests", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
