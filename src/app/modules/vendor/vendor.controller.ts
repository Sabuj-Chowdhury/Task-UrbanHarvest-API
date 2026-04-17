import { Request, Response } from "express";
import { IJWTUserPayload } from "../../types/types";
import tryAsync from "../../utils/tryAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { VendorServices } from "./vendor.service";

const applyVendor = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const user = req.user?.email as string;
    // console.log(user);

    const payload = req.body;

    const vendorApplication = await VendorServices.applyVendor(user, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vendor application successful",
      data: vendorApplication,
    });
  },
);

const certificationsVendor = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const userEmail = req.user?.email as string;

    const payload = req.body;

    const certification = await VendorServices.certificationsVendor(
      userEmail,
      payload,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Certification submitted successfully",
      data: certification,
    });
  },
);

export const VendorControllers = {
  applyVendor,
  certificationsVendor,
};
