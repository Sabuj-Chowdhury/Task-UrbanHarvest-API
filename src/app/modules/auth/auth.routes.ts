import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { authRateLimiter } from "../../middlewares/rateLimit";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, AuthControllers.registerUser);
authRouter.post("/login", authRateLimiter, AuthControllers.login);
