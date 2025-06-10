import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import reviewsService from "../services/reviewsService.js";

const getAllReviews = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;

  const productReviews = await reviewsService.findAllReviewsService(productId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { productReviews } });
});

const createReview = asyncWrapper(async (req, res, next) => {
  const validatedData = req.body;

  await reviewsService.createReviewService(validatedData);

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { review: validatedData } });
});

export { getAllReviews, createReview };
