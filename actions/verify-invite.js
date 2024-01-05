"use server";

import { getInvitationTokenByToken } from "@/data/invite-token"

export const verifyInvite = async (token) => {
  const inviteToken = await getInvitationTokenByToken(token);

  if (!inviteToken) {
    return { error: "Invalid invitation token!" };
  }

  return { success: "Invitation token verified!" };
}