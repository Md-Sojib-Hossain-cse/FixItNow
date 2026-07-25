import { Router } from "express";
import { adminCategoryController } from "./adminCategories.controller";

const router = Router()

router.post("/" , adminCategoryController.createCategory)

router.get("/" , adminCategoryController.getAllCategory)

router.patch("/:id" , adminCategoryController.updateCategory)

router.delete("/:id" , adminCategoryController.deleteCategory)

export const adminCategoryRoutes = router;