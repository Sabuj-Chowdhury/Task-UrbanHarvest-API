import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPostSchema, updatePostSchema } from "./communityPost.validation";
import { CommunityControllers } from "./communityPost.controller";

export const communityRouter = Router();

communityRouter.get("/", CommunityControllers.getPosts);

communityRouter.post(
  "/",
  checkAuth(Role.ADMIN, Role.VENDOR, Role.CUSTOMER),
  validateRequest(createPostSchema),
  CommunityControllers.createPost,
);

communityRouter.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.VENDOR, Role.CUSTOMER),
  CommunityControllers.deletePost,
);

communityRouter.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.VENDOR, Role.CUSTOMER),
  validateRequest(updatePostSchema),
  CommunityControllers.updatePost,
);
