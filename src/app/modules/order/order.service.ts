import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

const createOrder = async (
  userEmail: string,
  payload: { produceId: string; quantity: number },
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: { email: userEmail },
    });

    const product = await tx.produce.findUniqueOrThrow({
      where: { id: payload.produceId },
    });

    if (product.vendorId === user.id) {
      throw new AppError(httpStatus.FORBIDDEN, "Can't lease your own space");
    }

    if (product.availableQuantity < payload.quantity) {
      throw new AppError(httpStatus.BAD_REQUEST, "Not enough stock");
    }

    await tx.produce.update({
      where: { id: product.id },
      data: {
        availableQuantity: product.availableQuantity - payload.quantity,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: user.id,
        produceId: product.id,
        vendorId: product.vendorId,
        quantity: payload.quantity,
      },
    });

    return order;
  });
};

const getMyOrders = async (userEmail: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  return await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      produce: true,
    },
  });
};

const getVendorOrders = async (userEmail: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  return await prisma.order.findMany({
    where: { vendorId: vendor.id },
    include: {
      produce: true,
      user: true,
    },
  });
};

const updateOrderStatus = async (
  userEmail: string,
  orderId: string,
  status: OrderStatus,
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: { email: userEmail },
    });

    const vendor = await tx.vendorProfile.findFirstOrThrow({
      where: { userId: user.id },
    });

    const order = await tx.order.findUniqueOrThrow({
      where: { id: orderId },
    });

    if (order.vendorId !== vendor.id) {
      throw new AppError(httpStatus.FORBIDDEN, "Not your order");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(httpStatus.BAD_REQUEST, "Already processed");
    }

    if (status === OrderStatus.CANCELLED) {
      await tx.produce.update({
        where: { id: order.produceId },
        data: {
          availableQuantity: {
            increment: order.quantity,
          },
        },
      });
    }

    return await tx.order.update({
      where: { id: orderId },
      data: { status },
    });
  });
};

export const OrderServices = {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
};
