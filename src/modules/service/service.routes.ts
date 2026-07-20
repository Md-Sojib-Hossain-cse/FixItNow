import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router()

router.post("/" , auth(Roles.TECHNICIAN) , serviceController.createService)

router.patch("/:id" , auth(Roles.TECHNICIAN) , serviceController.updateService)

export const serviceRoutes = router;