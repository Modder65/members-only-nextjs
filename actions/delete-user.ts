"use server";

import prisma from "@/lib/prismadb";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const deleteUser = async (userId: string): Promise<{ success?: string; error?: string }> => {
  const role = await currentRole();

  if (role !== UserRole.OWNER) {
    return { error: "You don't have permission to delete a user!" };
  }

  if (!userId) {
    return { error: "UserId not found!" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!existingUser) {
    return { error: "User not found!" };
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { success: "User successfully deleted!" };
}