import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { validationResult } from "express-validator";
import cartService from "../services/cartService.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";

const getCartItems = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;

  const { userCartItems: cartItems } = await cartService.findCartItems(userId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { cartItems } });
});

const createCartItem = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;
  const validatedData = req.body;

  const { productId, quantity } = validatedData;

  const cartItemData = { userId, productId, quantity: quantity || 1 };

  const cartItem = await cartService.createCartItemService(cartItemData);

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { cartItem },
  });
});

const updateCartItemQuantity = asyncWrapper(async (req, res, next) => {
  const { cartItemId } = req.params;
  const validatedData = req.body;

  const { productId, quantity } = validatedData;

  await cartService.updateCartItemQuantityService({
    cartItemId,
    quantity,
    productId,
  });

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { newQuantity: quantity } });
});

const deleteCartItem = asyncWrapper(async (req, res, next) => {
  const { cartItemId } = req.params;
  const result = await cartService.deleteItemFromCart(+cartItemId);

  if (!result) {
    const error = new AppError(
      "Invalid cart item id",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

export { getCartItems, createCartItem, updateCartItemQuantity, deleteCartItem };
