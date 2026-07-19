import { Router } from "express";
import { technicianProfileController } from "./technicianProfile.controller";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router()

router.patch("/status" , auth(Roles.TECHNICIAN), technicianProfileController.updateAvailableStatus)

router.patch("/" , auth(Roles.TECHNICIAN), technicianProfileController.updateOwnTechnicianProfile)

export const technicianProfileRoutes = router;