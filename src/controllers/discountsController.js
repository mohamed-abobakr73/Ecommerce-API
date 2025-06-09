import { validationResult } from "express-validator";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import discountsService from "../services/discountsService.js";

const getAllDiscounts = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;

  const discounts = await discountsService.findAllDiscountsService(userId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { discounts } });
});

const createDiscount = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError(errors.array(), 400, httpStatusText.ERROR);
    return next(error);
  }
  const discountData = req.body;

  const discountCreated = await discountsService.createDiscount(discountData);

  if (!discountCreated) {
    const error = new AppError("Something went wrong, please try again");
    return next(error);
  }

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { discountData } });
});

const getDiscount = asyncWrapper(async (req, res, next) => {
  const { discountId } = req.params;
  const discount = await discountsService.findDiscount({
    discount_id: discountId,
  });
  if (!discount) {
    const error = new AppError(
      "Invalid discount id",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { discount } });
});

export { getAllDiscounts, getDiscount, createDiscount };
