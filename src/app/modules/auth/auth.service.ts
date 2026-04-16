import { Request } from "express";
import { IUserPayload } from "../user/user.interface";
import bcrypt from "bcryptjs";
import { envVariable } from "../../config/env";
import { prisma } from "../../config/prismaInstance";
import { UserStatus } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { generateToken } from "../../utils/jwt";

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

const login = async (payload: { email: string; password: string }) => {
  // 1. find  the user and status has to be active
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // 2. compare/ match the password
  const isMatchedPassword = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isMatchedPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password do not match!");
  }

  const JwtPayload = {
    email: user.email,
    role: user.role,
  };

  // 3. generate tokens

  const accessToken = generateToken(
    JwtPayload,
    envVariable.JWT.JWT_ACCESS_SECRET,
    envVariable.JWT.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    JwtPayload,
    envVariable.JWT.JWT_REFRESH_SECRET,
    envVariable.JWT.JWT_REFRESH_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const AuthServices = {
  registerUser,
  login,
};
