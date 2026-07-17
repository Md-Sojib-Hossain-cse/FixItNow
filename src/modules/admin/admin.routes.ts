import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router()

router.get("/users" , auth(Roles.ADMIN) , adminController.getAllUsers)

export const adminRoutes = router;