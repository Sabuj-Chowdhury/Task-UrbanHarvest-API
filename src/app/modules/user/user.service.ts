import { prisma } from "../../config/prismaInstance";

const getMe = async (email: string) => {
  const profile = await prisma.user.findUnique({
    where: { email },
  });

  return profile;
};

export const UserServices = {
  getMe,
};
