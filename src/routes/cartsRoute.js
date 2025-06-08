import { Router } from "express";
import {
  getCartItems,
  createCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/index.js";

const cartRouter = Router();

cartRouter.route("/").get(verifyToken, getCartItems);

cartRouter.route("/").post(verifyToken, createCartItem);

cartRouter.route("/:cartItemId").patch(verifyToken, updateCartItemQuantity);

cartRouter.route("/:cartItemId").delete(verifyToken, deleteCartItem);

export default cartRouter;
