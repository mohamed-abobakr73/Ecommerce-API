import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { validationResult } from "express-validator";
import cartService from "../services/cartService.js";
import productsService from "../services/productsService.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";

const getCartItems = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;
  const cart = await cartService.findCartItems(userId);

  if (!cart) {
    const error = appError.create("Invalid user id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const { cartId, cartItems } = cart;
  const productsIds = cartItems.map((product) => product.product_id);
  const products = await productsService.findProductsByIds(productsIds);

  const userCartItems = products.map((product, idx) => ({
    cartItemId: cartItems[idx].cart_items_id,
    product,
    quantity: cartItems[idx].quantity,
  }));

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { userCartItems } });
});

const addItemToCart = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;
  const { productId, quantity } = req.body;

  const cartId = await cartService.findCartId(userId);

  if (!cartId) {
    const error = appError.create("Invalid user id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const productExists = await productsService.findProduct(productId);
  if (!productExists) {
    const error = appError.create(
      "Invalid product id",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }

  const productStockQuantity = productExists.stockQuantity;
  if (!(productStockQuantity > 0 || productStockQuantity >= quantity)) {
    const error = appError.create(
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
    const error = appError.create(
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
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const result = await cartService.updateCartItemQuantity({
    cartItemId,
    quantity,
  });

  if (!result) {
    const error = appError.create(
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
    const error = appError.create(
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
