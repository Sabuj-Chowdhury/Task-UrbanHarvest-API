import { Request } from "express";
import { IUserPayload } from "../user/user.interface";
import bcrypt from "bcryptjs";
import { envVariable } from "../../config/env";
import { prisma } from "../../config/prismaInstance";

const registerUser = async (req: Request) => {
  const payload: IUserPayload = req.body;
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(envVariable.BCRYPT_SALT_ROUND),
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  return user;
};

export const AuthServices = {
  registerUser,
};
