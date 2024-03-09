import { PasswordResetToken } from "@prisma/client";
import prisma from "@/lib/prismadb";

export const getPasswordResetTokenByToken = async (token: string): Promise<PasswordResetToken | null> => {
  try { 
    const passwordResetToken: PasswordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string): Promise<PasswordResetToken | null> => {
  try { 
    const passwordResetToken: PasswordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

