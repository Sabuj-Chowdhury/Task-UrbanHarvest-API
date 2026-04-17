import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { IJWTUserPayload } from "../../types/types";
import { OrderServices } from "./order.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createOrder = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await OrderServices.createOrder(email, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order placed",
      data: result,
    });
  },
);

const getMyOrders = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await OrderServices.getMyOrders(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My orders",
      data: result,
    });
  },
);

const getVendorOrders = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await OrderServices.getVendorOrders(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vendor orders",
      data: result,
    });
  },
);

const updateStatus = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;
    const status = req.body.status;

    const result = await OrderServices.updateOrderStatus(email, id, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order updated",
      data: result,
    });
  },
);

export const OrderControllers = {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateStatus,
};
