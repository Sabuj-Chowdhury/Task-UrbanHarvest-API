import { z } from "zod";

export const createBookingSchema = z.object({
  duration: z.number().int().min(1, "Minimum 1 month").max(120, "Max 10 years"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["COMPLETED", "CANCELLED"]),
});
