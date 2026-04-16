import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { setCookies } from "../../utils/setCookies";

const registerUser = tryAsync(async (req: Request, res: Response) => {
  const user = await AuthServices.registerUser(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Registration successfull!",
    data: user,
  });
});

const login = tryAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthServices.login(payload);

  const { accessToken, refreshToken, user } = result;

  const tokenInfo = {
    accessToken,
    refreshToken,
  };

  // setting the cookie
  setCookies(res, tokenInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Logged in successfully!",
    data: user,
  });
});

export const AuthControllers = {
  registerUser,
  login,
};
