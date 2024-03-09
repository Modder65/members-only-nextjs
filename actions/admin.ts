"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async (): Promise<{ success?: string;  error?: string }> => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" };
}