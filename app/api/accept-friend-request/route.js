import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";


export async function POST(request) {
  const { friendRequestId } = await request.json();

  try {
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendRequestId },
      data: { status: 'ACCEPTED' },
    });
    return NextResponse.json(updatedFriendship, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending friend requests", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
