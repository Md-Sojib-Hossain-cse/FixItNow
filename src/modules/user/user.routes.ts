import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router()

router.patch("/update", auth(Roles.CUSTOMER , Roles.TECHNICIAN, Roles.ADMIN), userController.updateUserInfo)

export const userRoutes = router;