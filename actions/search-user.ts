"use server";

import { getUserByEmail } from "@/data/user";
import { SearchUserSchema } from "@/schemas";
import { z } from "zod"; 
import { PublicUserInfo } from "@/types/types";

// Define a list of unsearchable emails (e.g., your personal email)
const unsearchableEmails = [process.env.OWNER_EMAIL];

export const searchUser = async (values: z.infer<typeof SearchUserSchema>): Promise<{ error?: string; user?: PublicUserInfo }> => {
  const validatedFields = SearchUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;

  // Makes owner accounts unsearchable
  if (unsearchableEmails.includes(email)) {
    return { error: "User Not Found!" };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "User Not Found!" };
  }

  const publicUserInfo: PublicUserInfo = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role
  }

  return { user: publicUserInfo };
}