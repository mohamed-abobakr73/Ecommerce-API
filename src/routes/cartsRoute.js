import { Router } from "express";
import {
  getCartItems,
  createCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} from "../controllers/cartController.js";
import {
  validateRequestBody,
  verifyToken,
  cartItemValidation,
} from "../middlewares/index.js";

const cartRouter = Router();

cartRouter.route("/").get(verifyToken, getCartItems);

cartRouter
  .route("/")
  .post(verifyToken, cartItemValidation(), validateRequestBody, createCartItem);

cartRouter
  .route("/:cartItemId")
  .patch(
    verifyToken,
    cartItemValidation(true),
    validateRequestBody,
    updateCartItemQuantity
  );

cartRouter.route("/:cartItemId").delete(verifyToken, deleteCartItem);

export default cartRouter;
