import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import {
  ICertificatePayload,
  IVendorPayload,
  IVendorRequest,
} from "./vendor.interface";

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

export const VendorServices = {
  applyVendor,
  certificationsVendor,
};
