import prisma from "@/lib/prismadb";

export const getAccountByUserId = async (userId) => {
  try {
    const account = await prisma.account.findFirst({
      where: { id: userId }
    });

    return account;
  } catch {
    return null;
  }
};
