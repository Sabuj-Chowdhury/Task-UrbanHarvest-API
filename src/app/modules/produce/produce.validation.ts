import { z } from "zod";

export const createProduceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  availableQuantity: z.number().int().positive("Quantity must be positive"),
});

export const updateProduceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  availableQuantity: z.number().int().positive().optional(),
});
