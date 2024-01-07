"use server";

import * as z from "zod";

import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs"

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getInvitationTokenByEmail } from "@/data/invite-token";

export const register = async (values) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  
  const { email, password, name } = validatedFields.data;

  // Validate the invitation token a second time during registration
  const validInviteToken = await getInvitationTokenByEmail(email);
  console.log("Valid invite token:", validInviteToken);

  if (!validInviteToken) {
    return { error: "Invalid invitation token!" };
  }

  const hasExpired = new Date(validInviteToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Optionally delete the invitation token or mark it as used
  await prisma.inviteToken.delete({ where: { id: validInviteToken.id } });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "Confirmation email sent!" };
};