"use server";

import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";

export const deletePost = async (postId) => {
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

  if (post.user.id !== user.id && user.role !== UserRole.OWNER) {
    return { error: "Unauthorized action!" };
  }

  const deletedPost = await prisma.post.delete({
    where: { id: postId },
  });

  await pusherServer.trigger("posts-channel", "post:deleted", deletedPost);

  return { success: "Post successfully deleted!" };
}