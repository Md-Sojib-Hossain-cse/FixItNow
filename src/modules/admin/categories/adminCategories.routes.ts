import { Router } from "express";
import { adminCategoryController } from "./adminCategories.controller";
import { auth } from "../../../middlewares/auth";
import { Roles } from "../../../../generated/prisma/enums";

const router = Router()

router.post("/" , auth(Roles.ADMIN) , adminCategoryController.createCategory)

router.get("/" , auth(Roles.ADMIN) , adminCategoryController.getAllCategory)

router.patch("/:id" , auth(Roles.ADMIN) , adminCategoryController.updateCategory)

router.delete("/:id" , auth(Roles.ADMIN) , adminCategoryController.deleteCategory)

export const adminCategoryRoutes = router;