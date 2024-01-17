"use server";

import prisma from "@/lib/prismadb";

export const deleteUser = async (userId) => {
  if (!userId) {
    return { error: "UserId not found!" }
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { success: "User successfully deleted!" };
}