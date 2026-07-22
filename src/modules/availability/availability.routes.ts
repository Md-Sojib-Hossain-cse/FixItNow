import { Router } from "express";
import { availabilityController } from "./availability.controller";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router()

router.post("/" , auth(Roles.TECHNICIAN), availabilityController.createAvailability)

router.patch("/:id" , auth(Roles.TECHNICIAN), availabilityController.updateAvailability)

router.delete("/:id" , auth(Roles.TECHNICIAN), availabilityController.deleteAvailability)

export const availabilityRoutes = router;