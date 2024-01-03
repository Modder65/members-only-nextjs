import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";



export async function POST(request) {
  const session = await auth();
  const userId = session.user.id;
  const { message, commentId } = await request.json();

  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function(text) {
      return text.replace(/\s+/g, ' ').trim();
    }
  });

  try {
    const newreply = await prisma.reply.create({
      data: {
        message: sanitizedMessage, 
        user: { connect: { id: userId } },
        comment: { connect: { id: commentId }}
      },
      // Needed to match data structure of fetching replies; for pusher
      include: {
        user: {
          select: { name: true }
        }
      }
    });
   
    await pusherServer.trigger("replies-channel", "reply:created", newreply);
   
    return NextResponse.json({ message: "Reply created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}