"use server";

import { getInvitationTokenByToken } from "@/data/invite-token"

export const verifyInvite = async (token) => {
  const existingToken = await getInvitationTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid invitation token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  return { success: "Invitation token verified!" };
}