import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { pick } from "../../utils/pick";
import { AdminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = tryAsync(async (req: Request, res: Response) => {
  // page, limit  sort, order ---> pagination and sort
  // search, fields .....   -----> search and required fields to sort on
  const options = pick(req.query, ["page", "sort", "order", "limit"]);
  const filter = pick(req.query, ["role", "status", "email", "search"]);

  const result = await AdminServices.getAllUsers(options, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users retrieved Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const verifyCertification = tryAsync(async (req: Request, res: Response) => {
  const vendorId = req.params.vendorId as string;
  const { status } = req.body;

  const result = await AdminServices.verifyCertification(vendorId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor certification updated",
    data: result,
  });
});

const getVendorProfiles = tryAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getVendorProfiles();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "pending vendors",
    data: result,
  });
});

export const AdminControllers = {
  getAllUsers,
  verifyCertification,
  getVendorProfiles,
};
