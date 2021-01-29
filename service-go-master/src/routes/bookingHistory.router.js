import {Router} from "express";
import {isLoggedIn} from "../middlewares/auth";
import {getBookingHistoryPage, getBookingDetails, cancelBooking} from "../controllers/bookingHistory.controller";

export const bookingHistory = Router();

/**
 * @route         GET user/history
 * @description   Everything related to booking an specific service provider is under this route
 * @access        private
 */
bookingHistory.route("/").get(isLoggedIn, getBookingHistoryPage)

/**
 * @route         GET user/history/bookingDetails/:id
 * @description   Everything related to booking an specific service provider is under this route
 * @access        private
 */
bookingHistory.route("/bookingDetails/:id")
    .get(isLoggedIn, getBookingDetails)

/**
 * @route         GET user/book/getBookings
 * @description   Everything related to booking an specific service provider is under this route
 * @access        private
 */
bookingHistory.route("/cancelBooking/:id")
    .post(isLoggedIn, cancelBooking)