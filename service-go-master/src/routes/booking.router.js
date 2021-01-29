import { Router } from "express";
import {
  getBookingPage,
  postBooking,
  validateDateAndTime,
  cancelBooking,
  getBookingsById,
  updateBookingData
} from "../controllers/booking.controller";
import { progressbar, getProgressBar } from "../controllers/bar.controller";

// Create the router object from express app (that acts as a standalone app)
export const bookingRouter = Router();

/**
 * @route         GET user/book/getBookings
 * @description   Everything related to booking an specific service provider is under this route
 * @access        private
 */
bookingRouter.route("/getBookings").get(getBookingsById);

/**
 * @route         DELETE user/book/cancelBooking
 * @description   Deletes the booking
 * @access        private
 */
bookingRouter.route("/cancelBooking").post(cancelBooking);

/**
 * @route         GET POST DELETE /:handle
 * @description   Get the specific provider's or customer's booking using unique handler
 * @access        private
 */
bookingRouter
  .route("/:handle")
  .get(getBookingPage)
  .post(postBooking)
  .put(updateBookingData)
  .delete(cancelBooking);

/**
 * @route         POST user/book/
 * @description   Creates new booking object
 * @access        private
 */
bookingRouter.route("/").post(postBooking);
