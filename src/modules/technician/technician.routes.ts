import { Router } from "express";
import { technicianProfileController } from "./technician.controller";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router()

router.patch("/status" , auth(Roles.TECHNICIAN), technicianProfileController.updateAvailableStatus)

router.put("/profile" , auth(Roles.TECHNICIAN), technicianProfileController.updateOwnTechnicianProfile)

router.get("/" , technicianProfileController.getAllTechnician)

export const technicianRoutes = router;