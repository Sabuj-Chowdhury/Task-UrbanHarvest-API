import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPlantSchema, updatePlantSchema } from "./plants.validation";
import { PlantControllers } from "./plants.controller";

export const plantRouter = Router();

plantRouter.get("/", checkAuth(Role.CUSTOMER), PlantControllers.getPlants);

plantRouter.get("/:id", checkAuth(Role.CUSTOMER), PlantControllers.getPlant);

plantRouter.post(
  "/",
  checkAuth(Role.CUSTOMER),
  validateRequest(createPlantSchema),
  PlantControllers.createPlant,
);

plantRouter.patch(
  "/:id",
  checkAuth(Role.CUSTOMER),
  validateRequest(updatePlantSchema),
  PlantControllers.updatePlant,
);
