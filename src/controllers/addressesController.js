import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { validationResult } from "express-validator";
import appError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import checkIfUserExists from "../utils/checkIfUserExists.js";
import addressesService from "../services/addressesService.js";

const getAllAddresses = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const userDoNotExist = await checkIfUserExists(userId);
  if (userDoNotExist) {
    const error = appError.create("Invalid user id", 400, httpStatusText.FAIL);
    return next(error);
  }

  const addresses = await addressesService.findAllAddresses(userId);
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { addresses } });
});

const createAddress = asyncWrapper(async (req, res, next) => {
  const { userId } = req.body;

  const userDoNotExist = await checkIfUserExists(userId);
  if (userDoNotExist) {
    const error = appError.create("Invalid user id", 400, httpStatusText.FAIL);
    return next(error);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const addedAddress = await addressesService.addAddress(req.body);
  if (!addedAddress) {
    const error = appError.create(
      "Something went wrong, please try again later",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { createdAddress: req.body },
  });
});

export { getAllAddresses, createAddress };
