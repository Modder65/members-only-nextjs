"use server";

import { currentUser } from "@/lib/auth"
import { CreateCommentSchema } from "@/schemas";
import { pusherServer } from "@/lib/pusher";
import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prismadb";

export const createComment = async (values, postId) => {
  const user = await currentUser();

  const validatedFields = CreateCommentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { message } = validatedFields.data;

  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function(text) {
      return text.replace(/\s+/g, ' ').trim();
    }
  });

  const newComment = await prisma.comment.create({
    data: {
      message: sanitizedMessage,
      user: { connect: { id: user.id }},
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

  return { success: "Comment created successfully!" };
}