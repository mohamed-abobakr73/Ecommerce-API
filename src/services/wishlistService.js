import { check } from "express-validator";
import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import { wishlistServiceQueries } from "../utils/sqlQueries/index.js";
import { checkIfProductIsValid } from "./cartService.js";

const getAllWishlistItemsService = async (userId) => {
  const query =
    wishlistServiceQueries.findWishlistItemsQuery("WHERE user_id = ?;");

  const queryParams = [userId];

  const [result] = await db.execute(query, queryParams);

  return result;
};

const findWishlistItemService = async (data) => {
  const { userId, productId } = data;

  const query = wishlistServiceQueries.findWishlistItemsQuery(
    "WHERE user_id = ? AND products.product_id = ?;"
  );

  await checkIfProductIsValid(productId);

  const queryParams = [userId, productId];

  const [[result]] = await db.execute(query, queryParams);

  return result;
};

const addItemToWishlistService = async (data) => {
  const { userId, productId } = data;

  const query = wishlistServiceQueries.addItemToWishlistQuery;

  const queryParams = [userId, productId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "Item not added to wishlist");

  return result.affectedRows;
};

const removeItemFromWishlist = async (data) => {
  const { userId, productId } = data;

  const query = wishlistServiceQueries.deleteItemFromWishlistQuery;

  const queryParams = [userId, productId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "Item not removed from wishlist");

  return result.affectedRows;
};

export default {
  getAllWishlistItemsService,
  findWishlistItemService,
  addItemToWishlistService,
  removeItemFromWishlist,
};
