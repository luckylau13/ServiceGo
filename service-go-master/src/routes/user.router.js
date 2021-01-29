import { Router } from "express";
import {
  getDashboard,
  createProfile,
  editProfile,
  postCreateProfile,
  postEditProfile,
  getChatPage,
  getProfileList,
  changeAvailability,
  changeRate,
  deleteProfile,
  postReview
} from "../controllers/user.controller";
import { isLoggedIn } from "../middlewares/auth";
import { getProfile, uploadImage } from "../controllers/profile.controller";
import { bookingRouter } from "./booking.router";
import { paymentRouter } from "./payment.router";
import { getProgressBar } from "../controllers/bar.controller";
import { getServiceProviderPayment } from "../controllers/payment.controller";
import { bookingHistory } from "./bookingHistory.router";
import { Profile } from "../models/profile.model";
var multer = require("multer");

export const userRouter = Router();

userRouter
  .route("/")
  .get()
  .post();

userRouter
  .route("/dashboard")
  .get(isLoggedIn, getDashboard)
  .post();

userRouter
  .route("/create-profile")
  .get(isLoggedIn, createProfile)
  .post(isLoggedIn, postCreateProfile);

userRouter
  .route("/edit-profile")
  .get(isLoggedIn, editProfile)
  .post(isLoggedIn, postEditProfile);

userRouter
  .route("/profiles")
  .get(isLoggedIn, getProfileList)
  .delete(isLoggedIn, deleteProfile);

userRouter.route("/service").get(isLoggedIn, getServiceProviderPayment);

// post rate and review
userRouter.post("/review", postReview);
var multer = require("multer");

userRouter.post(
  "/profile/image",
  multer({ dest: "./src/public/photos" }).single("profileImage"),
  uploadImage
);

userRouter.route("/chat").get(getChatPage);

// TODO: pass isloggedIn middleware
userRouter.post("/avi", changeAvailability);
userRouter.post("/rate", changeRate);

userRouter.route("/:handle/profile").get(getProfile);

/**
 * @route         GET user/book
 * @description   Everything related to booking an specific service provider is under this route
 * @access        private
 */
userRouter.use("/book", bookingRouter);
userRouter.use("/payment", paymentRouter);
userRouter.route("/progress").get(getProgressBar);

userRouter.use("/payment", paymentRouter);

//route for booking history
userRouter.use("/history", bookingHistory);

userRouter.route("/progress").get(getProgressBar);

userRouter.route("/getLocation/:id").get(async (req, res) => {
  console.log(req.params.id);

  const profile = await Profile.findOne({ userId: req.params.id });
  res.json({ address: profile.address });
});
