import mongoose from "mongoose";
import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import passport from "passport";
const { check, validationResult } = require("express-validator");

// Login Controllers
export const getLoginPage = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
};

export const postLoginController = passport.authenticate("local", {
  successRedirect: "/user/dashboard",
  failureRedirect: "/login",
  failureFlash: true
});

// Register Controllers
export const getSignInPage = (req, res, next) => {
  res.render("signin");
};

export const postSignIn = async (req, res, next) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  const results = validationResult(req);
  const errors = results.errors;
  if (errors.length > 0 && Array.isArray(errors)) {
    res.render("signin", {
      errors: errors,
      name: newUser.name,
      email: newUser.email
    });
  } else {
    const user = await User.findOne({ email: newUser.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      let toBeSavedUser = new User(newUser);
      toBeSavedUser.save();
      req.flash("success", "Congratualtions! Login first to continue!");
      res.redirect("/user/dashboard");
    } else {
      let errors = [
        {
          param: "already"
        }
      ];
      res.render("signin", {
        errors: errors,
        name: newUser.name,
        email: newUser.email
      });
    }
  }
};

export const logOutUser = (req, res, next) => {
  req.logout();
  req.flash("success", "You are now logged out!");
  res.redirect("/login");
};

export const getSignInForProviderPage = (req, res, next) => {
  if (req.user) {
    res.redirect("/user/dashboard");
  } else {
    res.render("signin-serviceprovider");
  }
};
