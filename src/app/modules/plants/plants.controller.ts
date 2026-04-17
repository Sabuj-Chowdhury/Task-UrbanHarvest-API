import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { IJWTUserPayload } from "../../types/types";
import { PlantServices } from "./plants.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPlant = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const user = req.user;
    const email = user?.email as string;

    const result = await PlantServices.createPlant(email, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Plant created",
      data: result,
    });
  },
);

const getPlants = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const user = req.user;
    const email = user?.email as string;
    const result = await PlantServices.getPlants(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My plants",
      data: result,
    });
  },
);

const getPlant = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const user = req.user;
    const email = user?.email as string;
    const id = req.params.id as string;
    const result = await PlantServices.getPlantById(email, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Plant details",
      data: result,
    });
  },
);

const updatePlant = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const user = req.user;
    const email = user?.email as string;
    const id = req.params.id as string;
    const result = await PlantServices.updatePlant(email, id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Plant updated",
      data: result,
    });
  },
);

export const PlantControllers = {
  createPlant,
  getPlants,
  getPlant,
  updatePlant,
};
