import jwt from "jsonwebtoken";
import httpStatusText from "../utils/httpStatusText.js";
import AppError from "../utils/AppError.js";

const verifyToken = (req, res, next) => {
  const authHeaders =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeaders) {
    const error = new AppError(
      "No JWT token provided.",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }

  const token = authHeaders.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = new AppError("Invalid JWT token.", 401, httpStatusText.ERROR);
    return next(error);
  }
};

export default verifyToken;
