"use server";

import { getUserByEmail } from "@/data/user";
import { SearchUserSchema } from "@/schemas";

// Define a list of unsearchable emails (e.g., your personal email)
const unsearchableEmails = [process.env.OWNER_EMAIL];

export const searchUser = async (values) => {
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

  return { user: existingUser };
}