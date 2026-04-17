import { z } from "zod";

export const createPlantSchema = z.object({
  name: z.string().min(1),
  growthStage: z.string().min(1),
  healthStatus: z.string().min(1),
});

export const updatePlantSchema = z.object({
  name: z.string().optional(),
  growthStage: z.string().optional(),
  healthStatus: z.string().optional(),
});
