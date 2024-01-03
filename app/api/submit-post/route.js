import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(request) {
  const session = await auth();
  const userId = session.user.id;
  const { title, message, image } = await request.json();

  // Remove HTML/dangerous characters from data
  // Trims all whitespace including multiple spaces between words/characters
  // UI automatically does this so this ensures UI and database match eachother
  const sanitizedTitle = sanitizeHtml(title, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function(text) {
      return text.replace(/\s+/g, ' ').trim();
    }
  });

  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function(text) {
      return text.replace(/\s+/g, ' ').trim();
    }
  });

  try {
    const newPost = await prisma.post.create({
      data: {
        title: sanitizedTitle,
        message: sanitizedMessage,
        image: image,
        user: { connect: { id: userId }}
      },
      // Needed to match data structure of fetching posts; for pusher
      include: {
        user: { select: { name: true } },
        _count: {
          select: { comments: true }
        }
      }
    });

    await pusherServer.trigger("posts-channel", "post:created", newPost);
    
    return NextResponse.json({ message: "Post created successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}