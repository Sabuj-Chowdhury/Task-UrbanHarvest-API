import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createProduceSchema, updateProduceSchema } from "./produce.validation";
import { Role } from "@prisma/client";
import { ProduceControllers } from "./produce.controller";

export const produceRouter = Router();

produceRouter.get(
  "/my",
  checkAuth(Role.VENDOR),
  ProduceControllers.getMyProduce,
);

produceRouter.get("/", ProduceControllers.getAllProduce);
produceRouter.get("/:id", ProduceControllers.getSingleProduce);

produceRouter.post(
  "/",
  checkAuth(Role.VENDOR),
  validateRequest(createProduceSchema),
  ProduceControllers.createProduce,
);

produceRouter.patch(
  "/:id",
  checkAuth(Role.VENDOR),
  validateRequest(updateProduceSchema),
  ProduceControllers.updateProduce,
);

produceRouter.delete(
  "/:id",
  checkAuth(Role.VENDOR),
  ProduceControllers.deleteProduce,
);
