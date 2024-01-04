"use server";

import { currentUser } from "@/lib/auth";
import { CreatePostSchema } from "@/schemas";
import { pusherServer } from "@/lib/pusher";
import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prismadb";


export const createPost = async (values, image) => {
  const user = await currentUser();

  const validatedFields = CreatePostSchema.safeParse(values);
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

  const newPost = await prisma.post.create({
    data: {
      title: sanitizedTitle,
      message: sanitizedMessage,
      image: imageUrl,
      user: { connect: { id: user.id }}
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

  return { success: "Post created successfully!" };
}