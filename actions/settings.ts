"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { SettingsSchema } from "@/schemas";
import { z } from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>): Promise<{ success?: string; error?: string }> => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const validatedFields = SettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  // Destructure the validated and potentially updated fields
  const { email, password, newPassword, name, isTwoFactorEnabled } = validatedFields.data;

  // Handle email update with verification
  if (email && email !== user.email) {
    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    // Do not update the email directly; wait for verification
    return { success: "Verification email sent!" };
  }

  // Handle password update
  if (password && newPassword) {
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "User not found." };
    }

    const passwordsMatch = await bcrypt.compare(password, dbUser.password);
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { password: hashedPassword },
    });
  }

  // Handle other settings updates
  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name && { name }),
      ...(typeof isTwoFactorEnabled === 'boolean' && { isTwoFactorEnabled }),
      // Add other fields as needed
    },
  });

  return { success: "Settings updated successfully." };
};
