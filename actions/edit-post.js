"use server";

import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@/lib/auth";
import { EditPostSchema } from "@/schemas";
import prisma from "@/lib/prismadb";
import sanitizeHtml from "sanitize-html";

export const editPost = async (values, postId, image) => {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found!" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { user: true },
  });

  if (!post) {
    return { error: "Post not found!" };
  }

  if (post.user.id !== user.id) {
    return { error: "Unauthorized action!" };
  }

  const validatedFields = EditPostSchema.safeParse(values);
  const imageUrl = image;

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

  const editedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title: sanitizedTitle,
      message: sanitizedMessage,
      image: imageUrl,
    },
  });

  await pusherServer.trigger("posts-channel", "post:edited", editedPost);

  return { success: "Post updated successfully!" };
}