import profileData from "../data/profile.json";
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

/**
 * @description Renders view called booking with details about loggeed in user and service providers
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
export const getBookingPage = async (req, res) => {
  // Gets the profile of the service provider from params object using handle attribute
  let profile = await Profile.findOne({ handle: req.params.handle });
  // Send the view booking as the response to the client
  res.render("booking", {
    serviceProvider: profile,
    user: req.user
  });
};

/**
 * @description Creates new booking entry into database and send the user to payment page
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
export const postBooking = async (req, res) => {
  try {
    // Creates new booking entry into databse by using body key from request object
    const booking = await new Booking({
      type: req.body.type,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      service_provider: req.body.service_provider,
      customer: req.body.customer,
      status: "Not started."
    }).save();
    // Flashes the sucesss message
    req.flash("success", "Thank you for booking. We will keep you updated.");
    // If the booking is successfully created, stores the details to session
    // and redirects to payment page
    if (booking) {
      var ss = req.session;
      ss.serviceType = req.body.type;
      ss.serviceLocation = req.body.location;
      ss.time = req.body.time;
      ss.date = req.body.date;
      res.redirect("/user/payment");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description Get the booking details by id and send all the details of booking as response
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
export const getBookingsById = async (req, res) => {
  const bookings = await Booking.find({ service_provider: req.user.id });
  // Send response as json object with bookings details
  res.json({
    bookings: bookings
  });
};

/**
 * @description  Returns Profile of Service Provider by using handle attribute
 * @param {String} handler (unique username)
 */
const getProfileByHandler = handler =>
  profileData.filter(data => data.handler == handler);

/**
 * @description This function is responsible to validate the date and time of the booking
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
export const validateDateAndTime = (req, res) => {
  // Validate the request object by using express validator
  // https://express-validator.github.io/docs/
  const results = validationResult(req);
  const errors = results.errors;

  // If contains error response back that error
  if (errors.length > 0 && Array.isArray(errors)) {
    res.json(errors);
  } else {
    res.json({ success: false });
  }
};

/**
 * @description This function is responsible for cancelling the booking by id
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
export const cancelBooking = async (req, res) => {
  try {
    const result = await Booking.deleteOne({ _id: req.body.booking_id });
    // Response back the deleted booking id with message
    res.json({ id: req.body.booking_id, message: "successfully deleted" });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @description This function updates the booking detail (status) in DB using handle of that customer
 * @param {Object} req The request object from the client
 * @param {Object} res The response object that is to be sent to client
 */
export const updateBookingData = async (req, res) => {
  try {
    let id = req.params.handle;
    let booking = await Booking.findById(id);
    // Change the status attibute to that of the request object
    booking.status = req.body.status;

    // Save the updated booking details to the database
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking.id,
      booking,
      {
        new: true
      }
    );

    // Get the customers details with whom the above booking is related to
    let user = await User.findById(updatedBooking.customer);
    // And Send the email to that user
    const res = await sendMail(user.email, req.body.status);

    // Response back the updated booking
    res.json(updatedBooking);
  } catch (error) {
    res.json(error);
  }
};

/**
 * @description This function send the email to the user
 * @param {String} email
 * @param {String} status
 */
const sendMail = async (email, status) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if we don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport objetc
  let info = await transporter.sendMail({
    from: '"Service Go" <servicego@app.com>', // sender address
    to: email, // list of receivers
    subject: `Your Service is now ${status}`, // Subject line
    text: `Your Service is now ${status}`, // plain text body
    html: `<b>Your Service is now ${status}</b>` // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
