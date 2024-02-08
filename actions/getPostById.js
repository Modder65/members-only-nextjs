"use server"

import prisma from "@/lib/prismadb";

export const getPostById = async (postId) => {
  if (!postId) {
    return { error: "Cant find post!" };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    return { error: "Post not found!"}
  }

  return { post: post };
}