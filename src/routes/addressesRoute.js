import { Router } from "express";
import {
  createAddress,
  getAllAddresses,
} from "../controllers/addressesController.js";
import addressesValidation from "../middlewares/addressesValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
const addressesRouter = Router();

addressesRouter.route("/:userId").get(getAllAddresses);

addressesRouter
  .route("/")
  .post(verifyToken, addressesValidation(), createAddress);

export default addressesRouter;
