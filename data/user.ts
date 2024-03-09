import { User } from "@prisma/client";
import prisma from "@/lib/prismadb";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user: User = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
}

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user: User = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
}