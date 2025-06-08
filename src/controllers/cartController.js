import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { validationResult } from "express-validator";
import cartService from "../services/cartService.js";
import productsService from "../services/productsService.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";

const getCartItems = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;

  const cartItems = await cartService.findCartItems(userId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { cartItems } });
});

const addItemToCart = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;
  const { productId, quantity } = req.body;

  const cartId = await cartService.findCartId(userId);

  if (!cartId) {
    const error = new AppError("Invalid user id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const productExists = await productsService.findProduct(productId);
  if (!productExists) {
    const error = new AppError("Invalid product id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const productStockQuantity = productExists.stockQuantity;
  if (!(productStockQuantity > 0 || productStockQuantity >= quantity)) {
    const error = new AppError(
      "Not enough product stock qunatity for the requested quantity",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }

  const data = { userId, productId, quantity: quantity || 1 };

  const { result, quantity: newQuantity } = await cartService.addItemToCart(
    data
  );

  if (!result) {
    const error = new AppError(
      "Something went wrong, please try again",
      500,
      httpStatusText.ERROR
    );
    return next(error);
  }

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { productId, quantity: newQuantity },
  });
});

const updateCartItemQuantity = asyncWrapper(async (req, res, next) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;
  const errors = validationResult(req.body);

  if (!errors.isEmpty()) {
    const error = new AppError(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const result = await cartService.updateCartItemQuantity({
    cartItemId,
    quantity,
  });

  if (!result) {
    const error = new AppError(
      "Invalid cart item id",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }

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

export { getCartItems, addItemToCart, updateCartItemQuantity, deleteCartItem };
