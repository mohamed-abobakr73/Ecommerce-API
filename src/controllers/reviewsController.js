import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import appError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import checkIfUserExists from "../utils/checkIfUserExists.js";
import { validationResult } from "express-validator";
import reviewsService from "../services/reviewsService.js";
import productsService from "../services/productsService.js";

const getAllReviews = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;

  const validProductId = await productsService.findProduct(+productId);
  if (!validProductId) {
    const error = appError.create(
      "Invalid product id",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const productReviews = await reviewsService.findAllReviews(productId);
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { productReviews } });
});

const createReview = asyncWrapper(async (req, res, next) => {
  const { userId, productId } = req.body;

  const userDoNotExist = await checkIfUserExists(userId);

  if (userDoNotExist) {
    const error = appError.create("Invalid user id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const validProductId = await productsService.findProduct(productId);
  if (!validProductId) {
    const error = appError.create(
      "Invalid product id",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const addedReview = await reviewsService.addReview(req.body);
  if (!addedReview) {
    const error = appError.create(
      "Something went wrong, please try again later"
    );
    return next(error);
  }

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { reveiewData: req.body } });
});

export { getAllReviews, createReview };
