import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router()

router.get("/users" , auth(Roles.ADMIN) , adminController.getAllUsers)

router.patch("/users/:id" , auth(Roles.ADMIN) , adminController.updateUserStatus)

export const adminRoutes = router;