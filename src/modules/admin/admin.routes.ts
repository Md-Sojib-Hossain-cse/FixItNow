import { Router } from "express";
import { adminUserRoutes } from "./users/adminUser.routes";
import { adminCategoryRoutes } from "./categories/adminCategories.routes";

const router = Router()

router.use("/users" , adminUserRoutes)

router.use("/categories" , adminCategoryRoutes)

export const adminRoutes = router;