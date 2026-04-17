import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/user/user.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { vendorRouter } from "../modules/vendor/vendor.routes";
import { produceRouter } from "../modules/produce/produce.routes";
import { orderRouter } from "../modules/order/order.routes";

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
  {
    path: "/produce",
    route: produceRouter,
  },
  {
    path: "/order",
    route: orderRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
