import { Role } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

const createPost = async (
  userEmail: string,
  payload: { postContent: string },
) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  return await prisma.communityPost.create({
    data: {
      userId: user.id,
      postContent: payload.postContent,
    },
  });
};

const getPosts = async () => {
  return await prisma.communityPost.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      postDate: "desc",
    },
  });
};

const deletePost = async (userEmail: string, postId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const post = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
  });

  if (post.userId !== user.id && user.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Not authorized to delete this post",
    );
  }

  return await prisma.communityPost.delete({
    where: { id: postId },
  });
};

const updatePost = async (
  userEmail: string,
  postId: string,
  payload: { postContent: string },
) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const post = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
  });

  if (post.userId !== user.id && user.role !== "ADMIN") {
    throw new AppError(403, "Not authorized");
  }

  return prisma.communityPost.update({
    where: { id: postId },
    data: {
      postContent: payload.postContent,
    },
  });
};

export const CommunityServices = {
  createPost,
  getPosts,
  deletePost,
  updatePost,
};
