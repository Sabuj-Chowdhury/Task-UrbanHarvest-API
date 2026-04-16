import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { IJWTUserPayload } from "../../types/types";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const getMe = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const user = req.user;
    const email = user?.email as string;
    const profile = await UserServices.getMe(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User fetched successfully",
      data: profile,
    });
  },
);

export const UserControllers = {
  getMe,
};
