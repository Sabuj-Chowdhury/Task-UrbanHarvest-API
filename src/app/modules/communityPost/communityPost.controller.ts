import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { IJWTUserPayload } from "../../types/types";
import { CommunityServices } from "./communityPost.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const result = await CommunityServices.createPost(email, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post created",
      data: result,
    });
  },
);

const getPosts = tryAsync(async (req: Request, res: Response) => {
  const result = await CommunityServices.getPosts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts fetched",
    data: result,
  });
});

const deletePost = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;
    const result = await CommunityServices.deletePost(email, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post deleted",
      data: result,
    });
  },
);

const updatePost = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;
    const payload = req.body;

    const result = await CommunityServices.updatePost(email, id, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  },
);

export const CommunityControllers = {
  createPost,
  getPosts,
  deletePost,
  updatePost,
};
