import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router()

router.post("/" , auth(Roles.CUSTOMER , Roles.TECHNICIAN , Roles.ADMIN) , reviewController.createReview)

export const reviewRoutes = router