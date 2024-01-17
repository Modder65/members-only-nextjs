"use server";

import { getUserByEmail } from "@/data/user";
import { SearchUserSchema } from "@/schemas";

export const searchUser = async (values) => {
  const validatedFields = SearchUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "User Not Found!" };
  }

  return { user: existingUser };
}