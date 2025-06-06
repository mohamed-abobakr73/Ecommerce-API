import { Router } from "express";
import {
  getCartItems,
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
} from "../controllers/cartController.js";
import verifyToken from "../middlewares/verifyToken.js";

const cartRouter = Router();

cartRouter.route("/").get(verifyToken, getCartItems);
cartRouter.route("/").post(verifyToken, addItemToCart);
cartRouter.route("/:cartItemId").patch(verifyToken, updateCartItemQuantity);
cartRouter.route("/:cartItemId").delete(verifyToken, deleteCartItem);

export default cartRouter;
