import prisma from "@/lib/prismadb";

export const getInvitationTokenByToken = async (
  token
) => {
  try {
    const inviteToken = await prisma.inviteToken.findUnique({
      where: { token }
    });

    return inviteToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getInvitationTokenByEmail = async (
  email
) => {
  try {
    const inviteToken = await prisma.inviteToken.findFirst({
      where: { email }
    });

    return inviteToken;
  } catch {
    return null;
  }
}