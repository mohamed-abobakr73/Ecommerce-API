import { Router } from "express";
import {
  getAllWihslist,
  addOrRemoveItemToWishlist,
} from "../controllers/wishlistController.js";
import { verifyToken } from "../middlewares/index.js";

const wishlistRouter = Router();

wishlistRouter.route("/:userId").get(verifyToken, getAllWihslist);

wishlistRouter.route("/:userId").post(verifyToken, addOrRemoveItemToWishlist);

export default wishlistRouter;
