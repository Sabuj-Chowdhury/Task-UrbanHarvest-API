import { Router } from "express";
import { AuthControllers } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", AuthControllers.registerUser);
authRouter.post("/login", AuthControllers.login);
