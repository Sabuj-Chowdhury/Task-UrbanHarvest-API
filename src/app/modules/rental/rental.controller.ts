import { Request, Response } from "express";
import tryAsync from "../../utils/tryAsync";
import { RentalBookingServices } from "./rental.service";
import { IJWTUserPayload } from "../../types/types";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createBooking = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;
    const payload = req.body;

    const result = await RentalBookingServices.createBooking(
      email,
      id,
      payload,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rental space leased successfully!",
      data: result,
    });
  },
);

const getMyBookings = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await RentalBookingServices.getMyBookings(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My leased Rental spces!",
      data: result,
    });
  },
);

const getVendorBookings = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;

    const result = await RentalBookingServices.getVendorBookings(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vendor leased Rental spces!",
      data: result,
    });
  },
);

const updateBookingStatus = tryAsync(
  async (req: Request & { user?: IJWTUserPayload }, res: Response) => {
    const email = req.user?.email as string;
    const id = req.params.id as string;
    const payload = req.body;

    const result = await RentalBookingServices.updateBookingStatus(
      email,
      id,
      payload.status,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking status updated!",
      data: result,
    });
  },
);

const allRentalSpace = tryAsync(async (req: Request, res: Response) => {
  const result = await RentalBookingServices.allRentalSpace();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All rental space!",
    data: result,
  });
});

export const RentalBookingController = {
  createBooking,
  getMyBookings,
  getVendorBookings,
  updateBookingStatus,
  allRentalSpace,
};
