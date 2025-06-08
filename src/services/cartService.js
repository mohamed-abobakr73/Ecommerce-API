import db from "../configs/connectToDb.js";
import AppError from "../utils/AppError.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import httpStatusText from "../utils/httpStatusText.js";
import { cartServiceQueries } from "../utils/sqlQueries/index.js";
import productsService from "./productsService.js";

const checkIfProductIsValid = async (productId) => {
  const product = await productsService.findProductService(productId);

  checkIfResourceExists(product, "Product not found");

  return product;
};

const checkProductStockQuantity = (product, quantity) => {
  if (product.stockQuantity < quantity) {
    const error = new AppError(
      "Not enough product stock quantity for the requested quantity",
      400,
      httpStatusText.ERROR
    );
    throw error;
  }
};

const getCartItem = async (userId, productId) => {
  const { cartId, userCartItems: cartItems } = await findCartItems(userId);

  if (!cartItems || cartItems.length === 0) {
    return { cartId, cartItem: null };
  }

  const cartItem = cartItems.find(
    (item) => item.product.productId === productId
  );

  return { cartId, cartItem };
};

const getNewQuantity = (quantity, currentProductQuantity) => {
  if (quantity > 1) {
    return quantity;
  } else {
    return currentProductQuantity + quantity;
  }
};

const separateCartItemDetails = (cartItemsArray) => {
  const cartArray = cartItemsArray.map((cartItemData) => {
    const seller = {
      firstName: cartItemData.firstName,
      lastName: cartItemData.lastName,
      email: cartItemData.email,
      phone: cartItemData.phone,
      roleName: cartItemData.roleName,
    };

    const product = {
      productId: cartItemData.productId,
      productName: cartItemData.productName,
      productDescription: cartItemData.productDescription,
      price: cartItemData.price,
      stockQuantity: cartItemData.stockQuantity,
      createdAt: cartItemData.createdAt,
      brandName: cartItemData.brandName,
      categoryName: cartItemData.categoryName,
      imagePath: cartItemData.imagePath,
    };

    const cartItem = {
      cartItemId: cartItemData.cartItemId,
      cartId: cartItemData.cartId,
      quantity: cartItemData.quantity,
    };

    return { cartItem, product, seller };
  });

  return cartArray;
};

const findCartId = async (userId) => {
  const query = cartServiceQueries.findCartIdQuery;

  const queryParams = [userId];

  const [[{ cartId }]] = await db.execute(query, queryParams);

  checkIfResourceExists(cartId, "Cart not found");

  return cartId;
};

const findCartItems = async (userId) => {
  const cartId = await findCartId(userId);

  const query = cartServiceQueries.findCartItemsQuery;

  const queryParams = [cartId];

  const [cartItems] = await db.execute(query, queryParams);

  if (cartItems.length === 0) {
    return { cartId, userCartItems: [] };
  }

  const userCartItems = separateCartItemDetails(cartItems);

  return { cartId, userCartItems };
};

const createUserCartService = async (userId, databaseConnection) => {
  const query = cartServiceQueries.createUserCartQuery;

  const queryParams = [userId];

  const [result] = await databaseConnection.execute(query, queryParams);

  return result.affectedRows;
};

const createCartItemService = async (data) => {
  const { userId, productId, quantity } = data;

  const product = await checkIfProductIsValid(productId);

  checkProductStockQuantity(product, quantity);

  const { cartId, cartItem } = await getCartItem(userId, productId);

  let query;
  let queryParams;
  let cartItemData;
  let cartItemId;
  let newQuantity;
  let result;
  let errorMessage;

  if (cartItem) {
    query = cartServiceQueries.updateCartItemQuantityQuery;

    newQuantity = getNewQuantity(quantity, cartItem.cartItem.quantity);

    cartItemId = cartItem.cartItem.cartItemId;

    queryParams = [newQuantity, cartItemId];

    errorMessage = "error updating cart item";
  } else {
    query = cartServiceQueries.addCartItemQuery;

    queryParams = [cartId, productId, quantity];

    newQuantity = quantity;

    errorMessage = "error creating cart item";
  }

  [result] = await db.execute(query, queryParams);

  if (!cartItemId) {
    cartItemId = result.insertId;
  }

  checkIfResourceExists(result.affectedRows, errorMessage);

  cartItemData = {
    cartItemId: cartItemId,
    cartId,
    product,
    quantity: newQuantity,
  };

  return cartItemData;
};

const updateCartItemQuantityService = async (data) => {
  const { cartItemId, quantity, productId } = data;

  const product = await checkIfProductIsValid(productId, quantity);

  checkProductStockQuantity(product, quantity);

  const query = cartServiceQueries.updateCartItemQuantityQuery;

  const queryParams = [quantity, cartItemId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "cart item not found");

  return result.affectedRows;
};

const deleteItemFromCartService = async (cartItemId) => {
  const query = cartServiceQueries.deleteCartItemQuery;

  const queryParams = [cartItemId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "cart item not found");

  return result.affectedRows;
};

export default {
  findCartId,
  findCartItems,
  createUserCartService,
  createCartItemService,
  updateCartItemQuantityService,
  deleteItemFromCartService,
};
