"use server"

import { signOut } from "@/auth"

export const logout = async (): Promise<void> => {
  // some server stuff
  await signOut();
}