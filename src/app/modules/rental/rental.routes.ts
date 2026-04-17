import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "./rental.validation";
import { RentalBookingController } from "./rental.controller";

export const bookingRouter = Router();

bookingRouter.get("/", RentalBookingController.allRentalSpace);

bookingRouter.get(
  "/my",
  checkAuth(Role.CUSTOMER),
  RentalBookingController.getMyBookings,
);

bookingRouter.get(
  "/vendor",
  checkAuth(Role.VENDOR),
  RentalBookingController.getVendorBookings,
);

bookingRouter.post(
  "/:id",
  checkAuth(Role.CUSTOMER),
  validateRequest(createBookingSchema),
  RentalBookingController.createBooking,
);

bookingRouter.patch(
  "/:id",
  checkAuth(Role.VENDOR),
  validateRequest(updateBookingStatusSchema),
  RentalBookingController.updateBookingStatus,
);
