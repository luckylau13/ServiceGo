import { Profile } from "../models/profile.model";
import mongoose from "mongoose";
import { Booking } from "../models/booking.model";
let isProvider;
var moment = require("moment");
let category = require("../data/categories.json");
let availability = require("../data/availability.json");
const editJsonFile = require("edit-json-file");
let file = editJsonFile(`../data/availability.json`);

export const getDashboard = async (req, res) => {
  try {
    let bookings, actualDate, provider, customer;
    const profile = await Profile.findOne({ userId: req.user.id });
    const profileCreated = profile ? true : false;
    if (profileCreated) {
      isProvider = profile.provider;
      if (isProvider) {
        req.isProvider = true;
        bookings = await Booking.find({ service_provider: req.user.id });

        actualDate = moment(bookings.date).format("dddd, MMMM Do YYYY");
      } else {
        req.isProvider = false;
        bookings = await Booking.find({ customer: req.user.id });
        actualDate = moment(bookings.date).format("dddd, MMMM Do YYYY");
      }
    }

    const loggedUser = await Profile.findOne({ userId: req.user.id });
    res.render("boardash", {
      profileCreated,
      isProvider,
      bookings,
      actualDate,
      loggedUser,
      availability
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getProfileList = (req, res) => {
  Profile.find({})
    .then(response => {
      res.render("profileList", {
        profiles: response
      });
    })
    .catch(err => console.log(err));
};

export const createProfile = async (req, res) => {
  res.render("create-profile", {
    user: req.user,
    categories: category
  });
};

export const editProfile = (req, res) => {
  Profile.findOne({ email: req.user.email })
    .then(respond => {
      console.log(respond);
      res.render("edit-profile", {
        user: req.user,
        profile: respond,
        categories: category
      });
    })
    .catch(err => console.log(err));
};

export const deleteProfile = (req, res) => {
  console.log("deleteProfile", req.body.email);
  Profile.deleteOne({ email: req.body.email })
    .then(respond => {
      res.send("success");
    })
    .catch(err => res.send(err));
};

export const postCreateProfile = async (req, res) => {
  try {
    let service_provider = req.body.provider === "on" ? true : false;
    let profile = {
      phone: req.body.phone,
      address: req.body.address,
      email: req.user.email,
      name: req.user.name,
      handle: req.body.handle,
      provider: service_provider,
      userId: req.user.id
    };

    if (profile.provider) {
      profile.category = req.body.category;
      profile.description = req.body.description;
    }

    const profileData = await new Profile(profile).save();
    const profileCreated = profileData ? true : false;

    if (profileCreated) {
      isProvider = profile.provider;
    }
    res.redirect("/user/dashboard");
  } catch (error) {
    throw new Error(error);
  }
};

export const postEditProfile = (req, res) => {
  Profile.findOneAndUpdate(
    {
      email: req.user.email
    },
    {
      $set: {
        phone: req.body.phone,
        address: req.body.address,
        fname: req.body.firstName,
        lname: req.body.lastName,
        category: req.body.who === "on" ? req.body.category : "",
        description: req.body.description,
        provider: req.body.who === "on" ? true : false
      }
    },
    {
      new: true
    }
  ).then(response => {
    res.redirect("/user/dashboard");
  });
};

export const getChatPage = (req, res, next) => {
  res.render("chat");
};

export const changeAvailability = (req, res, next) => {
  const data = req.body.data;
  console.log(data);
  res.json("Success");
};

export const changeRate = (req, res, next) => {
  const data = req.body;
  console.log(data);
  res.json("Success");
};

export const postReview = (req, res, next) => {
  const data = req.body;
  console.log(data);
};
