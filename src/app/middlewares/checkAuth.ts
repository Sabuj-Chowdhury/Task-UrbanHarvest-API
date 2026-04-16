import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status";

import { envVariable } from "../config/env";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
      //   console.log(accessToken);
      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No Token Received!");
      }

      const verifyTokenResult = verifyToken(
        accessToken,
        envVariable.JWT.JWT_ACCESS_SECRET,
      );

      // set the user if token is verified
      req.user = verifyTokenResult;
      //   console.log(req.user);

      if (roles.length && !roles.includes(verifyTokenResult.role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "NOT Authorized!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
