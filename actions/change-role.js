"use server";

import prisma from "@/lib/prismadb";

export const changeRole = async (userId, newRole) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });
    return { message: "User role updated successfully" };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};