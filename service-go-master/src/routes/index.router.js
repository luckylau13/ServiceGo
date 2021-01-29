import { Router } from "express";

import {
  getHomePage,
  getSearch,
  getSearchCategory,
  getSearchedProfile,
  checkLoggedIn
} from "../controllers/index.controller";
import {
  getLoginPage,
  postLoginController,
  getSignInPage,
  postSignIn,
  logOutUser,
  getSignInForProviderPage
} from "../controllers/auth";

import { loginValidator, registerValidator } from "../utils/validation";

export const indexRouter = Router();

// Homepage route
indexRouter.route("/").get(getHomePage);

// Routes for Search Page
indexRouter.route("/search").get(getSearch);
indexRouter.route("/search-category").get(getSearchCategory);
indexRouter.route("/profile-search").post(getSearchedProfile);
// Checks and returns whether someone is logged in or not and returns data
indexRouter.route("/loggedin").post(checkLoggedIn);

// Login Route
indexRouter
  .route("/login")
  .get(getLoginPage)
  .post(loginValidator, postLoginController);

indexRouter
  .route("/signin")
  .get(getSignInPage)
  .post(registerValidator, postSignIn);

indexRouter.route("/logout").get(logOutUser);
