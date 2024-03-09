import { TwoFactorToken } from "@prisma/client";
import prisma from "@/lib/prismadb";

export const getTwoFactorTokenByToken = async (token: string): Promise<TwoFactorToken | null> => {
  try {
    const twoFactorToken: TwoFactorToken = await prisma.twoFactorToken.findUnique({
      where: { token }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
}

export const getTwoFactorTokenByEmail = async (email: string): Promise<TwoFactorToken | null> => {
  try {
    const twoFactorToken: TwoFactorToken = await prisma.twoFactorToken.findFirst({
      where: { email }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
}