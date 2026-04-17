import { z } from "zod";

export const createPostSchema = z.object({
  postContent: z
    .string()
    .min(1, "Post cannot be empty")
    .max(1000, "Post too long"),
});

export const updatePostSchema = z.object({
  postContent: z.string().min(1).max(1000),
});
