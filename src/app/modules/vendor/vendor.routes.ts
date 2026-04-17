import { Router } from "express";
import { VendorControllers } from "./vendor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";

export const vendorRouter = Router();

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
