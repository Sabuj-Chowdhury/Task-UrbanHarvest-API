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

const createRentalSpace = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const userEmail = req.user?.email as string;

    const payload = req.body;

    const rentalSpace = await VendorServices.createRentalSpace(
      userEmail,
      payload,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "rental space listed successfully",
      data: rentalSpace,
    });
  },
);

const updateRentalSpace = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;

    const result = await VendorServices.updateRentalSpace(email, id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rental space updated",
      data: result,
    });
  },
);

const getMyRentalSpaces = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await VendorServices.getMyRentalSpaces(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My rental spaces",
      data: result,
    });
  },
);

const deleteRentalSpace = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;

    const result = await VendorServices.deleteRentalSpace(email, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rental space deleted",
      data: result,
    });
  },
);

export const VendorControllers = {
  applyVendor,
  certificationsVendor,
  createRentalSpace,
  updateRentalSpace,
  getMyRentalSpaces,
  deleteRentalSpace,
};
