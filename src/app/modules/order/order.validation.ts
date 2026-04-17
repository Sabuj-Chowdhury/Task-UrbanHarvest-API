import z from "zod";

export const createOrderZodSchema = z.object({
  quantity: z.number().int().positive(),
  produceId: z.string(),
});
