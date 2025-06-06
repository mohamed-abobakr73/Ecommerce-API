import { Router } from "express";
import {
  createReview,
  getAllReviews,
} from "../controllers/reviewsController.js";
import verifyToken from "../middlewares/verifyToken.js";
import reviewsValidation from "../middlewares/reviewsValidation.js";
const reviewsRouter = Router();

reviewsRouter.route("/:productId").get(getAllReviews);
reviewsRouter.route("/").post(verifyToken, reviewsValidation(), createReview);

export default reviewsRouter;
