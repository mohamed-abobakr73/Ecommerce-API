import express from "express";
import { Router } from "express";
import {
  stripePayment,
  stripeWebHook,
} from "../controllers/stripeController.js";
import orderValidation from "../middlewares/orderValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAllowed from "../middlewares/isAllowed.js";
import usersRoles from "../utils/usersRoles.js";

const stripeRouter = Router();

stripeRouter
  .route("/create-checkout-session")
  .post(verifyToken, orderValidation(), stripePayment);
stripeRouter
  .route("/webhook")
  .post(verifyToken, express.json({ type: "application/json" }), stripeWebHook);

export default stripeRouter;
