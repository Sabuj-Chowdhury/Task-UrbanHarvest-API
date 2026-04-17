import { CertificationStatus } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { IProducePayload } from "./produce.interface";

const createProduce = async (userEmail: string, payload: IProducePayload) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: userEmail,
    },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: {
      userId: user.id,
    },
  });

  if (vendor.certificationStatus !== CertificationStatus.APPROVED) {
    throw new AppError(httpStatus.FORBIDDEN, "Vendor not approved");
  }

  const existing = await prisma.produce.findFirst({
    where: {
      vendorId: vendor.id,
      name: payload.name,
    },
  });

  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product already exists");
  }

  const item = await prisma.produce.create({
    data: {
      vendorId: vendor.id,
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      availableQuantity: payload.availableQuantity,
    },
  });

  return item;
};

const updateProduce = async (
  userEmail: string,
  id: string,
  payload: Partial<IProducePayload>,
) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  const product = await prisma.produce.findUniqueOrThrow({
    where: { id },
  });

  if (product.vendorId !== vendor.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your product");
  }

  const updatedItem = await prisma.produce.update({
    where: { id },
    data: payload,
  });

  return updatedItem;
};

const deleteProduce = async (userEmail: string, id: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  const product = await prisma.produce.findUniqueOrThrow({
    where: { id },
  });

  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product not found");
  }

  if (product.vendorId !== vendor.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your product");
  }

  const result = await prisma.produce.delete({
    where: { id },
  });

  return result;
};

const getMyProduce = async (userEmail: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  const myItems = await prisma.produce.findMany({
    where: { vendorId: vendor.id },
  });

  return myItems;
};

const getAllProduce = async () => {
  return await prisma.produce.findMany();
};

const getSingleProduce = async (id: string) => {
  return await prisma.produce.findUniqueOrThrow({
    where: { id },
  });
};

export const ProduceServices = {
  createProduce,
  updateProduce,
  deleteProduce,
  getMyProduce,
  getAllProduce,
  getSingleProduce,
};
