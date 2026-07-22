import { categoryController } from './category.controller';
import { Router } from "express";

const router = Router()

router.get("/" , categoryController.getAllCategory)

export const categoryRoutes = router