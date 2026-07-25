import { Router } from "express";
import { adminUserController } from "./adminUser.controller";

const router = Router()

router.get("/" , adminUserController.getAllUsers)

router.get("/:id", adminUserController.getSingleUser)

router.patch("/:id" ,  adminUserController.updateUserStatus)

router.patch("/:id/delete" , adminUserController.updateUserDeleteStatus)

export const adminUserRoutes = router;