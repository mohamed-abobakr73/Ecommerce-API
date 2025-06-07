import AppError from "./AppError.js";
import httpStatusText from "./httpStatusText.js";

const checkIfResourceExists = (resource, message) => {
  if (!resource) {
    const error = new AppError(message, 404, httpStatusText.NOT_FOUND);
    throw error;
  }
};

export default checkIfResourceExists;
