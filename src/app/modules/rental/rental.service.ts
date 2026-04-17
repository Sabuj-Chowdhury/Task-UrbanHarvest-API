import { BookingStatus } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

const createBooking = async (
  userEmail: string,
  rentalId: string,
  payload: { duration: number },
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: { email: userEmail },
    });

    const rental = await tx.rentalSpace.findUniqueOrThrow({
      where: { id: rentalId },
    });

    const vendor = await tx.vendorProfile.findFirst({
      where: { userId: user.id },
    });

    if (vendor && vendor.id === rental.vendorId) {
      throw new AppError(httpStatus.FORBIDDEN, "Cannot book your own space");
    }

    const existing = await tx.rentalBooking.findFirst({
      where: {
        rentalSpaceId: rental.id,
        status: BookingStatus.ACTIVE,
      },
    });

    if (existing) {
      throw new AppError(httpStatus.CONFLICT, "Rental already leased");
    }

    const duration = payload.duration;

    if (duration <= 0 || duration > 120) {
      throw new AppError(httpStatus.CONFLICT, "Duration must be 1–120 months");
    }

    const booking = await tx.rentalBooking.create({
      data: {
        userId: user.id,
        vendorId: rental.vendorId,
        rentalSpaceId: rental.id,
        duration,
      },
    });

    await tx.rentalSpace.update({
      where: { id: rental.id },
      data: { availability: false },
    });
    return booking;
  });
};

const getMyBookings = async (userEmail: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  return await prisma.rentalBooking.findMany({
    where: { userId: user.id },
    include: {
      rentalSpace: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getVendorBookings = async (userEmail: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  return await prisma.rentalBooking.findMany({
    where: { vendorId: vendor.id },
    include: {
      user: true,
      rentalSpace: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateBookingStatus = async (
  userEmail: string,
  bookingId: string,
  status: BookingStatus,
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: { email: userEmail },
    });

    const vendor = await tx.vendorProfile.findFirstOrThrow({
      where: { userId: user.id },
    });

    const booking = await tx.rentalBooking.findUniqueOrThrow({
      where: { id: bookingId },
    });

    if (booking.vendorId !== vendor.id) {
      throw new AppError(httpStatus.FORBIDDEN, "Not your booking");
    }

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, "Already processed");
    }

    const updated = await tx.rentalBooking.update({
      where: { id: bookingId },
      data: { status },
    });

    if (
      status === BookingStatus.CANCELLED ||
      status === BookingStatus.COMPLETED
    ) {
      await tx.rentalSpace.update({
        where: { id: booking.rentalSpaceId },
        data: { availability: true },
      });
    }

    return updated;
  });
};

const allRentalSpace = async () => {
  return await prisma.rentalSpace.findMany({});
};

export const RentalBookingServices = {
  createBooking,
  getMyBookings,
  getVendorBookings,
  updateBookingStatus,
  allRentalSpace,
};
