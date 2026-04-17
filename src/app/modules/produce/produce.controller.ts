import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { IJWTUserPayload } from "../../types/types";
import { ProduceServices } from "./produce.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProduce = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await ProduceServices.createProduce(email, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product created",
      data: result,
    });
  },
);

const updateProduce = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;
    const result = await ProduceServices.updateProduce(email, id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product updated",
      data: result,
    });
  },
);

const deleteProduce = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;
    const result = await ProduceServices.deleteProduce(email, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product deleted",
      data: result,
    });
  },
);

const getMyProduce = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await ProduceServices.getMyProduce(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My products",
      data: result,
    });
  },
);

const getAllProduce = tryAsync(async (req: Request, res: Response) => {
  const result = await ProduceServices.getAllProduce();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All products",
    data: result,
  });
});

const getSingleProduce = tryAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProduceServices.getSingleProduce(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product details",
    data: result,
  });
});

export const ProduceControllers = {
  createProduce,
  updateProduce,
  deleteProduce,
  getMyProduce,
  getAllProduce,
  getSingleProduce,
};
