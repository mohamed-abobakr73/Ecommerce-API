import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";

const validateRequestBody = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new AppError(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  next();
};

export default validateRequestBody;
