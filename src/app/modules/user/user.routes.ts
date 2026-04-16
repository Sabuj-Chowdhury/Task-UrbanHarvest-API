import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserControllers } from "./user.controller";

export const userRouter = Router();

userRouter.get("/me", checkAuth(), UserControllers.getMe);
