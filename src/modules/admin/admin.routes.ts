import { Router } from "express";
import { adminUserRoutes } from "./users/adminUser.routes";
import { adminCategoryRoutes } from "./categories/adminCategories.routes";
import { adminBookingRoutes } from "./bookings/adminBookings.routes";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router()

router.use("/users" ,auth(Roles.ADMIN), adminUserRoutes)

router.use("/categories" ,auth(Roles.ADMIN), adminCategoryRoutes)

router.use("/bookings" ,auth(Roles.ADMIN), adminBookingRoutes)

export const adminRoutes = router;