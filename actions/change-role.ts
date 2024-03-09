"use server";

import prisma from "@/lib/prismadb";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const changeRole = async (userId: string, newRole: string): Promise<{ message?: string, error?: string}> => {
  try {
    const requestingUserRole = await currentRole();

    // Check if the requesting user is an admin and restrict role changes
    if (requestingUserRole === UserRole.ADMIN) {
      // Prevent an admin from modifying other admins or owners
      const targetUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!targetUser || targetUser.role === UserRole.ADMIN || targetUser.role === UserRole.OWNER) {
        return { error: "Unauthorized role change attempt!" };
      }

      // Restrict role changes to USER or BANNED
      if (newRole !== UserRole.USER && newRole !== UserRole.BANNED) {
        return { error: "Admins can only assign USER or BANNED roles!" };
      }
    }

    // Only owners can change roles to ADMIN or OWNER
    if (requestingUserRole !== UserRole.OWNER && (newRole === UserRole.ADMIN || newRole === UserRole.OWNER)) {
      return { error: "Only owners can assign ADMIN or OWNER roles!" };
    }

    // Proceed with role update
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