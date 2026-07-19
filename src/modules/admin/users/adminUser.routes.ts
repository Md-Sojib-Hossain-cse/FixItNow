import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import { Roles } from "../../../../generated/prisma/enums";
import { adminUserController } from "./adminUser.controller";

const router = Router()

router.get("/" , auth(Roles.ADMIN) , adminUserController.getAllUsers)

router.patch("/:id" , auth(Roles.ADMIN) , adminUserController.updateUserStatus)

export const adminUserRoutes = router;