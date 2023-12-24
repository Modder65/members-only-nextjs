import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";


export async function GET(request) {
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
