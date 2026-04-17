import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";
import { AdminControllers } from "./admin.controller";

export const adminRouter = Router();

adminRouter.get(
  "/all-user",
  checkAuth(Role.ADMIN),
  AdminControllers.getAllUsers,
);
