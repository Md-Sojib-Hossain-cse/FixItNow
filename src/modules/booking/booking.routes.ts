import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Roles } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router()

router.post("/" , auth(Roles.CUSTOMER), bookingController.createBooking)

router.patch("/:id/cancel" , auth(Roles.CUSTOMER), bookingController.cancelBooking)

router.patch("/:id/reject" , auth(Roles.TECHNICIAN), bookingController.declineBooking)

router.patch("/:id/accept" , auth(Roles.TECHNICIAN), bookingController.acceptBooking)

router.patch("/:id/in-progress" , auth(Roles.TECHNICIAN), bookingController.inProgressBooking)

router.get("/my-bookings" , auth(Roles.CUSTOMER , Roles.TECHNICIAN, Roles.ADMIN), bookingController.getMyBookings)

router.get("/:id" , auth(Roles.CUSTOMER , Roles.TECHNICIAN, Roles.ADMIN), bookingController.getSingleBooking)

export const bookingRoutes = router;