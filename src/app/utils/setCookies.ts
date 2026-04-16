import { Response } from "express";

export interface IAuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setCookies = (res: Response, tokenInfo: IAuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60, // 1 hour
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 90, //90 days
    });
  }
};
