import { asyncWrapper } from "../middlewares/asyncWrapper.js";
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
  const validatedData = req.body;

  await discountsService.createDiscountService(validatedData);

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { discount: validatedData },
  });
});

const getDiscount = asyncWrapper(async (req, res, next) => {
  const { discountId } = req.params;

  const discount = await discountsService.findDiscountService(discountId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { discount } });
});

export { getAllDiscounts, getDiscount, createDiscount };
