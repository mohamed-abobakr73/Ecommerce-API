import AppError from "./AppError.js";
import httpStatusText from "./httpStatusText.js";

const checkIfResourceExists = (resource, message) => {
  if (!resource) {
    const error = new AppError(message, 400, httpStatusText.ERROR);
    throw error;
  }
};

export default checkIfResourceExists;
