import { Router } from "express";

import { indexRouter } from "./index.router";
import { userRouter } from "./user.router";

import { errorHandler } from "../services/errorHandler";
import { validateDateAndTime } from "../controllers/booking.controller";
import { bookingValidation } from "../utils/validation";
import { reviewRouter } from "./review.router";

export const router = Router();

// Index route
router.use("/", indexRouter);
router.use("/user", userRouter);
router.use("/review", reviewRouter);

router.post("/validateDateAndTime", bookingValidation, validateDateAndTime);
// At last > for error handling
router.use(errorHandler);
