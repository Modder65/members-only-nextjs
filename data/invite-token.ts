import { InviteToken } from "@prisma/client";
import prisma from "@/lib/prismadb";

export const getInvitationTokenByToken = async (
  token: string
): Promise<InviteToken | null> => {
  try {
    const inviteToken: InviteToken = await prisma.inviteToken.findUnique({
      where: { token }
    });

    return inviteToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getInvitationTokenByEmail = async (
  email: string
): Promise<InviteToken | null> => {
  try {
    const inviteToken: InviteToken = await prisma.inviteToken.findFirst({
      where: { email }
    });

    return inviteToken;
  } catch {
    return null;
  }
}