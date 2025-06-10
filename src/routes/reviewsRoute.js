import { Router } from "express";
import {
  createReview,
  getAllReviews,
} from "../controllers/reviewsController.js";
import {
  verifyToken,
  reviewsValidation,
  validateRequestBody,
} from "../middlewares/index.js";

const reviewsRouter = Router();

reviewsRouter.route("/:productId").get(getAllReviews);

reviewsRouter
  .route("/")
  .post(verifyToken, reviewsValidation(), validateRequestBody, createReview);

export default reviewsRouter;
