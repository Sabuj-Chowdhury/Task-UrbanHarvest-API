import { prisma } from "../../config/prismaInstance";
import { IVendorPayload, IVendorRequest } from "./vendor.interface";

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

export const VendorServices = {
  applyVendor,
};
