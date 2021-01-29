/*
    This class is for handling the booking history function which rendering user to the correct page and information
*/
import { Profile } from "../models/profile.model";
import { Booking } from "../models/booking.model";
import { User } from "../models/user.model";
//initialise the variable for the method
let isProvider; //boolean value to determine whether the user is provider or not
var moment = require("moment"); //make the proper format of the date

/**
 * @route         GET user/history
 * @returns       Renders a page with their booking list
 */
//this function is for redirecting to the booking history page
export const getBookingHistoryPage = async (req, res) => {
  let bookings, actualDate;
  const profile = await Profile.findOne({ userId: req.user.id });
  isProvider = profile.provider;
  if (isProvider) {
    bookings = await Booking.find({ service_provider: req.user.id });
  } else {
    bookings = await Booking.find({ customer: req.user.id });
  }
  let message = "No Booking!";
  actualDate = moment(bookings.date).format("dddd, MMMM Do YYYY");

  res.render("bookingHistory", {
    isProvider,
    bookings,
    actualDate,
    message
  });
}

/**
 * @description This function is for redirecting to the booking details page
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
  //this function is for checking the single information of booking
  export const getBookingDetails = async (req, res) => {
    const profile = await Profile.findOne({ userId: req.user.id });
    isProvider = profile.provider;
    try {

    let customerDetails, providerDetails;
    const bookings = await Booking.findOne({ _id: req.params.id });
    let actualDate = moment(bookings.date).format("dddd, MMMM Do YYYY");

    customerDetails = await User.findOne({ _id: bookings.customer });
    providerDetails = await User.findOne({ _id: bookings.service_provider });

    res.render("bookingDetails", {
      bookings,
      actualDate,
      customerDetails,
      providerDetails,
      isProvider
    });
  } catch (err) {
    throw new Error(err);
  }
};


  /**
 * @description This function is responsible for cancelling the booking by id
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
  export const cancelBooking = async (req, res) => {
    try {
      await Booking.findOneAndUpdate({ _id: req.params.id},
      {
        $set: {
          status: "Cancelled" //set the status Cancelled to the database
        }
      },
      {
        useFindAndModify: false
      })
    res.redirect("/user/history");
  } catch (err) {
    throw new Error(err);
  }
};
