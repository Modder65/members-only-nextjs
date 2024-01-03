import prisma from "@/lib/prismadb";

export const getTwoFactorTokenByToken = async (token) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: { token }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
}

export const getTwoFactorTokenByEmail = async (email) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: { email }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
}