import { Router } from "express";
import { VendorControllers } from "./vendor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";

export const vendorRouter = Router();

vendorRouter.get(
  "/rental-spaces/my",
  checkAuth(Role.VENDOR),
  VendorControllers.getMyRentalSpaces,
);

vendorRouter.post(
  "/apply",
  checkAuth(Role.CUSTOMER),
  VendorControllers.applyVendor,
);

vendorRouter.post(
  "/certifications",
  checkAuth(Role.CUSTOMER, Role.VENDOR),
  VendorControllers.certificationsVendor,
);

vendorRouter.post(
  "/rental-spaces",
  checkAuth(Role.VENDOR),
  VendorControllers.createRentalSpace,
);

vendorRouter.patch(
  "/rental-spaces/:id",
  checkAuth(Role.VENDOR),
  VendorControllers.updateRentalSpace,
);

vendorRouter.delete(
  "/rental-spaces/:id",
  checkAuth(Role.VENDOR),
  VendorControllers.deleteRentalSpace,
);
