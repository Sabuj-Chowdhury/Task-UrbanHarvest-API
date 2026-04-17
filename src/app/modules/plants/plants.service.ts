import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { IPlantPayload } from "./plants.interface";

const createPlant = async (userEmail: string, payload: IPlantPayload) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  return await prisma.plant.create({
    data: {
      userId: user.id,
      name: payload.name,
      growthStage: payload.growthStage,
      healthStatus: payload.healthStatus,
    },
  });
};

const getPlants = async (userEmail: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  return await prisma.plant.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
};

const getPlantById = async (userEmail: string, id: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const plant = await prisma.plant.findUniqueOrThrow({
    where: { id },
  });

  if (plant.userId !== user.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your plant");
  }

  return plant;
};

const updatePlant = async (
  userEmail: string,
  id: string,
  payload: Partial<IPlantPayload>,
) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const plant = await prisma.plant.findUniqueOrThrow({
    where: { id },
  });

  if (plant.userId !== user.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your plant");
  }

  return await prisma.plant.update({
    where: { id },
    data: payload,
  });
};

export const PlantServices = {
  createPlant,
  getPlants,
  getPlantById,
  updatePlant,
};
