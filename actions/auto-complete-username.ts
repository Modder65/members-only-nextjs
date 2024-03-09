"use server";

import prisma from "@/lib/prismadb";

type UserNameOnly = {
  name: string | null;
}

export const autoCompleteUserName = async (partialName: string): Promise<string[]> => {
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

  return users.map((user: UserNameOnly) => user.name).filter((name: string | null): name is string => name !== null);
}