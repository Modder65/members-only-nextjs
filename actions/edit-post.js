"use server";

import { pusherServer } from "@/lib/pusher";
import { EditPostSchema } from "@/schemas";
import prisma from "@/lib/prismadb";
import sanitizeHtml from "sanitize-html";

export const editPost = async (values, postId) => {
  const validatedFields = EditPostSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { title, message } = validatedFields.data;

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

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: sanitizedTitle,
      message: sanitizedMessage,
    },
  });

  return { success: "Post updated successfully!" };
}