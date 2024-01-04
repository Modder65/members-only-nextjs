"use server";

import { generateInviteToken } from "@/lib/tokens";
import { InvitationSchema } from "@/schemas";
import { sendInvitationEmail } from "@/lib/mail";

export const invite = async (values) => {
  const validatedFields = InvitationSchema.safeParse(values);

  const { email } = validatedFields.data;

  const inviteToken = await generateInviteToken(email);

  await sendInvitationEmail(inviteToken.email, inviteToken.token);

  return { success: "Invitation link sent!" };
}