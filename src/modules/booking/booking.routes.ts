import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router()

router.post("/" , auth(Roles.CUSTOMER), bookingController.createBooking)

export const bookingRoutes = router;