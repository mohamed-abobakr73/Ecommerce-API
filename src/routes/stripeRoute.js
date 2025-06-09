import { Router } from "express";
import { stripePayment } from "../controllers/stripeController.js";
import {
  orderValidation,
  validateRequestBody,
  verifyToken,
} from "../middlewares/index.js";

const stripeRouter = Router();

stripeRouter
  .route("/create-checkout-session")
  .post(verifyToken, orderValidation(), validateRequestBody, stripePayment);

export default stripeRouter;
