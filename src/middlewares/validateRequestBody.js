import { validationResult } from "express-validator";

const validateRequestBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array());
    error.status = 400;
    return next(error);
  }
  next();
};

export default validateRequestBody;
