"use server";

import { currentUser } from "@/lib/auth"
import { CreateReplySchema } from "@/schemas";
import { pusherServer } from "@/lib/pusher";
import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prismadb";

export const createReply = async (values, commentId) => {
  const user = await currentUser();

  const validatedFields = CreateReplySchema.safeParse(values);

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

  const newReply = await prisma.reply.create({
    data: {
      message: sanitizedMessage, 
      user: { connect: { id: user.id } },
      comment: { connect: { id: commentId }}
    },
    // Needed to match data structure of fetching replies; for pusher
    include: {
      user: {
        select: { name: true }
      }
    }
  });

  await pusherServer.trigger("replies-channel", "reply:created", newReply);

  return { success: "Reply created successfully!" };
}