import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import {
  ICertificatePayload,
  ISpacePayload,
  IVendorPayload,
  IVendorRequest,
} from "./vendor.interface";
import { CertificationStatus } from "@prisma/client";

const applyVendor = async (userEmail: string, payload: IVendorPayload) => {
  // find the user
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: userEmail,
    },
  });

  const existingVendor = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingVendor && existingVendor.certificationStatus !== "REJECTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already applied for vendor",
    );
  }

  // 🔁 Case 2: Previously rejected → allow reapply (UPDATE)
  if (existingVendor && existingVendor.certificationStatus === "REJECTED") {
    return await prisma.vendorProfile.update({
      where: { userId: user.id },
      data: {
        farmName: payload.farmName,
        farmLocation: payload.farmLocation,
        certificationStatus: "PENDING", // reset
      },
    });
  }

  const vendorPayload: IVendorRequest = {
    userId: user?.id,
    farmName: payload.farmName,
    farmLocation: payload.farmLocation,
  };

  const vendorApplication = await prisma.vendorProfile.create({
    data: vendorPayload,
  });

  return vendorApplication;
};

const certificationsVendor = async (
  userEmail: string,
  payload: ICertificatePayload,
) => {
  // Find user
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  // Find vendor profile
  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  // existing certificate
  const existingCertificate = await prisma.sustainabilityCert.findFirst({
    where: { vendorId: vendor.id },
  });

  if (vendor.certificationStatus === CertificationStatus.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Certification already approved",
    );
  }

  if (
    vendor.certificationStatus === CertificationStatus.PENDING &&
    existingCertificate
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Certification already submitted",
    );
  }

  if (
    vendor.certificationStatus === CertificationStatus.REJECTED &&
    existingCertificate
  ) {
    return await prisma.sustainabilityCert.update({
      where: { id: existingCertificate.id },
      data: {
        certifyingAgency: payload.certifyingAgency,
        certificationDate: new Date(payload.certificationDate),
      },
    });
  }

  // Create certification
  const certification = await prisma.sustainabilityCert.create({
    data: {
      vendorId: vendor.id,
      certifyingAgency: payload.certifyingAgency,
      certificationDate: new Date(payload.certificationDate),
    },
  });

  return certification;
};

const createRentalSpace = async (userEmail: string, payload: ISpacePayload) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  if (vendor.certificationStatus !== CertificationStatus.APPROVED) {
    throw new AppError(httpStatus.FORBIDDEN, "Vendor not approved");
  }

  const rentalSpace = await prisma.rentalSpace.create({
    data: {
      vendorId: vendor.id,
      location: payload.location,
      size: payload.size,
      price: payload.price,
    },
  });

  return rentalSpace;
};

const updateRentalSpace = async (
  userEmail: string,
  id: string,
  payload: Partial<ISpacePayload>,
) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  const rental = await prisma.rentalSpace.findUniqueOrThrow({
    where: { id },
  });

  // Ownership check
  if (rental.vendorId !== vendor.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your rental space");
  }

  return await prisma.rentalSpace.update({
    where: { id },
    data: payload,
  });
};

const getMyRentalSpaces = async (userEmail: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  return await prisma.rentalSpace.findMany({
    where: { vendorId: vendor.id },
  });
};

const deleteRentalSpace = async (userEmail: string, id: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: userEmail },
  });

  const vendor = await prisma.vendorProfile.findFirstOrThrow({
    where: { userId: user.id },
  });

  const rental = await prisma.rentalSpace.findUniqueOrThrow({
    where: { id },
  });

  if (!rental) {
    throw new AppError(httpStatus.BAD_REQUEST, "no such rental spaces");
  }

  if (rental.vendorId !== vendor.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your rental space");
  }

  const result = await prisma.rentalSpace.delete({
    where: { id },
  });

  return result;
};

export const VendorServices = {
  applyVendor,
  certificationsVendor,
  createRentalSpace,
  getMyRentalSpaces,
  updateRentalSpace,
  deleteRentalSpace,
};
