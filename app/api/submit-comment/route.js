import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(request) {
  const session = await auth();
  const userId = session.user.id;
  const { message, postId } = await request.json();

  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function(text) {
      return text.replace(/\s+/g, ' ').trim();
    }
  });

  try {
    const newComment = await prisma.comment.create({
      data: {
        message: sanitizedMessage,
        user: { connect: { id: userId } },
        post: { connect: { id: postId }}
      },
      // Needed to match data structure of fetching comments; for pusher
      include: {
        user: { select: { name: true }},
        _count: {
          select: { replies: true }
        }
      }
    });
    
    await pusherServer.trigger("comments-channel", "comment:created", newComment);

    return NextResponse.json({ message: "Comment created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

 