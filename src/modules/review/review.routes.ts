import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router()

router.post("/" , auth(Roles.CUSTOMER , Roles.TECHNICIAN , Roles.ADMIN) , reviewController.createReview)

router.get("/" , auth(Roles.CUSTOMER , Roles.TECHNICIAN , Roles.ADMIN) , reviewController.getMyReview)

router.get("/:id" , auth(Roles.CUSTOMER , Roles.TECHNICIAN , Roles.ADMIN) , reviewController.getSingleReview)

router.patch("/:id" , auth(Roles.CUSTOMER , Roles.TECHNICIAN , Roles.ADMIN) , reviewController.updateReview)

router.delete("/:id" , auth(Roles.CUSTOMER , Roles.TECHNICIAN , Roles.ADMIN) , reviewController.deleteReview)

export const reviewRoutes = router;