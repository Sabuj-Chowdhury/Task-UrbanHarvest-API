import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/user/user.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { vendorRouter } from "../modules/vendor/vendor.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/vendor",
    route: vendorRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
