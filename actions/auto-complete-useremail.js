"use server";

import prisma from "@/lib/prismadb";

export const autoCompleteUserEmail = async (partialEmail) => {
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: partialEmail,
        mode: 'insensitive', // for case-insensitive search
      },
      NOT: {
        email: process.env.OWNER_EMAIL, // Exclude the owner's email from suggestions
      },
    },
    select: {
      email: true,
    },
    take: 5, // limit the number of results
  });

  return users.map(user => user.email);
}