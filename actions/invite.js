"use server";

import { generateInviteToken } from "@/lib/tokens";
import { InvitationSchema } from "@/schemas";
import { sendInvitationEmail } from "@/lib/mail";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const invite = async (values) => {
  const role = await currentRole();

  if (role !== UserRole.OWNER) {
    return { error: "You do not have permission to send invites!" };
  }

  const validatedFields = InvitationSchema.safeParse(values);

  const { email } = validatedFields.data;

  const inviteToken = await generateInviteToken(email);

  await sendInvitationEmail(inviteToken.email, inviteToken.token);

  return { success: "Invitation link sent!" };
}