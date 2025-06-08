import { Router } from "express";
import {
  createAddress,
  getUserAddresses,
} from "../controllers/addressesController.js";
import {
  addressesValidation,
  verifyToken,
  validateRequestBody,
} from "../middlewares/index.js";

const addressesRouter = Router();

addressesRouter.route("/:userId").get(getUserAddresses);

addressesRouter
  .route("/")
  .post(verifyToken, addressesValidation(), validateRequestBody, createAddress);

export default addressesRouter;
