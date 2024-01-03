import prisma from "@/lib/prismadb";

export const getTwoFactorConfirmationByUserId = async (userId) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      where: { userId }
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};