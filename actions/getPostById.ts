"use server"

import prisma from "@/lib/prismadb";
import { Post } from "@prisma/client";

export const getPostById = async (postId: string): Promise<{ post?: Post; error?: string }> => {
  if (!postId) {
    return { error: "Cant find post!" };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    return { error: "Post not found!"}
  }

  return { post };
}