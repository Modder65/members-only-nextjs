"use server";

export const autoCompleteUserEmail = async (partialEmail) => {
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: partialEmail,
        mode: 'insensitive', // for case-insensitive search
      },
    },
    select: {
      email: true,
    },
    take: 5, // limit the number of results
  });

  return users.map(user => user.email);
}