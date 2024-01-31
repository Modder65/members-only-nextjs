"use server";

import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";

export const deletePost = async (postId) => {
  if (!postId) {
    return { error: "Post not found!" };
  }

  const deletedPost = await prisma.post.delete({
    where: { id: postId },
  });

  await pusherServer.trigger("posts-channel", "post:deleted", deletedPost);

  return { success: "Post successfully deleted!" };
}