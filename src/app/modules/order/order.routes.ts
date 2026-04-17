import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";
import { OrderControllers } from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createOrderZodSchema } from "./order.validation";

export const orderRouter = Router();

orderRouter.get("/my", checkAuth(Role.CUSTOMER), OrderControllers.getMyOrders);

orderRouter.get(
  "/vendor",
  checkAuth(Role.VENDOR),
  OrderControllers.getVendorOrders,
);

orderRouter.post(
  "/",
  checkAuth(Role.CUSTOMER),
  validateRequest(createOrderZodSchema),
  OrderControllers.createOrder,
);

orderRouter.patch(
  "/:id",
  checkAuth(Role.VENDOR),
  OrderControllers.updateStatus,
);
