import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = tryAsync(async (req: Request, res: Response) => {
  const user = await AuthServices.registerUser(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Registration successfull!",
    data: user,
  });
});

export const AuthControllers = {
  registerUser,
};
