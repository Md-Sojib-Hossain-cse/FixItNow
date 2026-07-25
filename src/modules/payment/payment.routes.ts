import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router()

router.post("/:id/initiate" ,auth(Roles.CUSTOMER , Roles.TECHNICIAN, Roles.ADMIN), paymentController.initiatePayment)

router.post("/:id/success" , paymentController.successPayment)

router.post("/:id/failed" , paymentController.failPayment)

router.post("/:id/cancel" , paymentController.cancelPayment)

export const paymentRoutes = router;