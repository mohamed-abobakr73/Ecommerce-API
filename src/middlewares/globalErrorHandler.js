import httpStatusText from "../utils/httpStatusText.js";

const globalErrorHandler = (error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
};

export default globalErrorHandler;
