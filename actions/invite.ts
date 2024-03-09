"use server";

import { generateInviteToken } from "@/lib/tokens";
import { InvitationSchema } from "@/schemas";
import { sendInvitationEmail } from "@/lib/mail";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { z } from "zod";

export const invite = async (values: z.infer<typeof InvitationSchema>): Promise<{ success?: string; error?: string }> => {
  const role = await currentRole();

  if (role !== UserRole.OWNER) {
    return { error: "You do not have permission to send invites!" };
  }

  const validatedFields = InvitationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;

  const inviteToken = await generateInviteToken(email);

  await sendInvitationEmail(inviteToken.email, inviteToken.token);

  return { success: "Invitation link sent!" };
}