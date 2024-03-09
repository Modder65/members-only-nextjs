import { TwoFactorConfirmation } from "@prisma/client";
import prisma from "@/lib/prismadb";

export const getTwoFactorConfirmationByUserId = async (userId: string): Promise<TwoFactorConfirmation | null> => {
  try {
    const twoFactorConfirmation: TwoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      where: { userId }
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};