import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router()

router.post("/" , auth(Roles.TECHNICIAN) , serviceController.createService)

router.patch("/:id" , auth(Roles.TECHNICIAN) , serviceController.updateService)

router.delete("/:id" , auth(Roles.ADMIN, Roles.TECHNICIAN), serviceController.deleteService)

router.get("/:id/reviews" , serviceController.getServiceReviews)

router.get("/", serviceController.getAllServices)

router.get("/:id", serviceController.getSingleService)

export const serviceRoutes = router;