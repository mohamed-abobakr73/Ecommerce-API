import { Router } from "express";
import {
  getAllWishlist,
  addOrRemoveItemToWishlist,
} from "../controllers/wishlistController.js";
import {
  verifyToken,
  wishlistValidation,
  validateRequestBody,
} from "../middlewares/index.js";

const wishlistRouter = Router();

wishlistRouter.route("/:userId").get(verifyToken, getAllWishlist);

wishlistRouter
  .route("/:userId")
  .post(
    verifyToken,
    wishlistValidation(),
    validateRequestBody,
    addOrRemoveItemToWishlist
  );

export default wishlistRouter;
