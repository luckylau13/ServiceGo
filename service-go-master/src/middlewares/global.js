import { urlencoded, json } from "body-parser";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import expressValidator from "express-validator";
import flash from "express-flash-messages";

import LocalStrategy from "../utils/passport-auth";

require("dotenv").config();

const globalMiddleware = app => {
  // Morgan for logging only in dev en
  // if (
  //   process.env.NODE_ENV === "dev" ||
  //   process.env.NODE_ENV === "development"
  // ) {
  //   app.use(morgan("dev"));
  // }
  app.use(flash());

  // Body parser
  app.use(urlencoded({ extended: false }));
  app.use(json());

  // Express Session
  app.use(
    session({
      secret: "somsecret", // session secret
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );
  // Using password local Strategy
  LocalStrategy(passport);
  app.use(passport.initialize());
  app.use(passport.session());
};

export default globalMiddleware;
