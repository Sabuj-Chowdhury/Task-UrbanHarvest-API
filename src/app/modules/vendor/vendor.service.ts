import { prisma } from "../../config/prismaInstance";
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
