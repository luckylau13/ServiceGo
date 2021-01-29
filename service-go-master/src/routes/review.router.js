import { Router } from "express";
import {
  getAllReviewsByUserId,
  createAReview
} from "../controllers/review.controller";
export const reviewRouter = Router();

reviewRouter.route("/").post(createAReview);

reviewRouter.route("/:userId").get(getAllReviewsByUserId);
