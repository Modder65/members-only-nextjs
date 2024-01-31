"use sever";

import prisma from "@/lib/prismadb";

export const deletePost = async (postId) => {
  if (!postId) {
    return { error: "Post not found!" };
  }

  await prisma.post.delete({
    where: { id: postId },
  });
}