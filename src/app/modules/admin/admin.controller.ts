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

const getAllOrders = tryAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sort", "order"]);
  const filter = pick(req.query, [
    "status",
    "userId",
    "vendorId",
    "produceId",
    "search",
  ]);

  const result = await AdminServices.getAllOrders(options, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All orders retrieved",
    meta: result.meta,
    data: result.data,
  });
});

const getAllProduce = tryAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sort", "order"]);
  const filter = pick(req.query, ["category", "vendorId", "search"]);

  const result = await AdminServices.getAllProduce(options, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All produce retrieved",
    meta: result.meta,
    data: result.data,
  });
});

const getAllRentalSpaces = tryAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sort", "order"]);
  const filter = pick(req.query, [
    "location",
    "availability",
    "vendorId",
    "search",
  ]);

  const result = await AdminServices.getAllRentalSpaces(options, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All rental spaces retrieved",
    meta: result.meta,
    data: result.data,
  });
});

export const AdminControllers = {
  getAllUsers,
  verifyCertification,
  getVendorProfiles,
  getAllOrders,
  getAllProduce,
  getAllRentalSpaces,
};
