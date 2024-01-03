import prisma from "@/lib/prismadb";

export const getVerificationTokenByToken = async (
  token
) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email
) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
  } catch {
    return null;
  }
}