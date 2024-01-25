"use server";

import prisma from "@/lib/prismadb";

export const autoCompleteUserName = async (partialName) => {
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: partialName,
        mode: 'insensitive', // for case-insensitive search
      },
    },
    select: {
      name: true,
    },
    take: 5, // limit the number of results
  });

  return users.map(user => user.name);
}