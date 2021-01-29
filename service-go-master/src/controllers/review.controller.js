import { Booking } from "../models/booking.model";
import { Review } from "../models/review.model";
import { Profile } from "../models/profile.model";

export const getAllReviewsByUserId = async (req, res) => {
  let userId = req.params.userId;
  let profile = await Profile.findOne({ userId: userId });
  let reviews;
  if (profile.provider) {
    reviews = await Review.find({ serviceProvider: userId });
  } else {
    reviews = await Review.find({ customer: userId });
  }
  res.json(reviews);
};
//Configuring to create reviwe with the values below in DB

export const createAReview = async (req, res) => {
  let bookingId = req.body.bookingId;
  let text = req.body.text;
  let stars = Number(req.body.stars);
  let user = req.user.id;

  //service provider
  let booking = await Booking.findById(bookingId);
  let serviceProvider = booking.service_provider;

  let review = new Review({
    text: text,
    stars: stars,
    customer: user,
    serviceProvider: serviceProvider
  });

  //   Save review to DB
  let response = await review.save();

  res.json(response);
};
