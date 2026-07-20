import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router()

router.post("/" , auth(Roles.TECHNICIAN) , serviceController.createService)

router.patch("/:id" , auth(Roles.TECHNICIAN) , serviceController.updateService)

router.get("/", serviceController.getAllServices)

export const serviceRoutes = router;