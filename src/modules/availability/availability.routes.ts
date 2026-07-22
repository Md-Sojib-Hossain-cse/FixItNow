import { Router } from "express";
import { availabilityController } from "./availability.controller";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router()

router.post("/" , auth(Roles.TECHNICIAN), availabilityController.createAvailability)

export const availabilityRoutes = router;