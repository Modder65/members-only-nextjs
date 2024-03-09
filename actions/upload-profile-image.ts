"use server";

import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export const uploadProfileImage = async (imageUrl: string): Promise<{ success?: string; error?: string }> => {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found!" };
  }

  if (!imageUrl) {
    return { error: "Image URL not provided!" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { image: imageUrl }
  });

  return { success: "Image Uploaded Successfully!" };
}