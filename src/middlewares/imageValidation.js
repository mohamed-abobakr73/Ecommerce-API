import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";

const imageValidation = (req, res, next) => {
  if (!req.file) {
    const error = new AppError("No file uploaded", 400, httpStatusText.ERROR);
    return next(error);
  }
  next();
};

export default imageValidation;
