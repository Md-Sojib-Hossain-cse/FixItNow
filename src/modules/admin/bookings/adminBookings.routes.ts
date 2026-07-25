import { Router } from "express";
import { adminBookingController } from "./adminBookings.controller";

const router = Router()

router.get("/", adminBookingController.getAllBookings)

router.patch("/:id", adminBookingController.updateBooking)

router.delete("/:id", adminBookingController.deleteBooking)

export const adminBookingRoutes = router;