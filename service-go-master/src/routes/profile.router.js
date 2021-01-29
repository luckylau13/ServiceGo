import { Router } from "express";
import { logTheProfileController } from "../controllers/profile.controller";
import { isLoggedIn } from "../middlewares/auth";

export const profileRouter = Router();


profileRouter
.route("/")
.get(logTheProfileController)
.post();

profileRouter
  .route("/:id")
  .get()
  .put()
  .delete();
  


