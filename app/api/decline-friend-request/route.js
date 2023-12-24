import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";


export async function GET(request) {
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
