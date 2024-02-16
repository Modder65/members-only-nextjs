"use server";

import { currentUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/prismadb";

export const uploadProfileImage = async (imageUrl) => {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found!" };
  }

  if (!imageUrl) {
    return { error: "Image not found!" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { image: imageUrl }
  });

  return { success: "Image Uploaded Successfully!" };
}