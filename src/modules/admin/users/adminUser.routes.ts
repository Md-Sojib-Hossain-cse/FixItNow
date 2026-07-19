import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import { Roles } from "../../../../generated/prisma/enums";
import { adminUserController } from "./adminUser.controller";

const router = Router()

router.get("/" , auth(Roles.ADMIN) , adminUserController.getAllUsers)

router.get("/:id", auth(Roles.ADMIN) , adminUserController.getSingleUser)

router.patch("/:id" , auth(Roles.ADMIN) , adminUserController.updateUserStatus)

router.patch("/:id/delete" , auth(Roles.ADMIN) , adminUserController.updateUserDeleteStatus)

export const adminUserRoutes = router;