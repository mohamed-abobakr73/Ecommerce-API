import db from "../configs/connectToDb.js";
import { wishlistServiceQueries } from "../utils/sqlQueries/index.js";

const getAllwishlistItems = async (userId) => {
  const query =
    wishlistServiceQueries.findWishlistItemsQuery("WHERE user_id = ?;");

  const queryParams = [userId];

  const [result] = await db.execute(query, queryParams);

  return result;
};

const findWishlistItem = async (data) => {
  const { userId, productId } = data;
  const query = wishlistServiceQueries.findWishlistItemsQuery(
    "WHERE user_id = ? AND product_id = ?;"
  );

  const queryParams = [userId, productId];

  const [[result]] = await db.execute(query, queryParams);

  return result;
};

const addItemToWishlist = async (data) => {
  const { userId, productId } = data;
  const query = wishlistServiceQueries.addItemToWishlistQuery;

  const queryParams = [userId, productId];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

const removeItemFromWishlist = async (data) => {
  const { userId, productId } = data;
  const query = wishlistServiceQueries.deleteItemFromWishlistQuery;

  const queryParams = [userId, productId];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

export default {
  getAllwishlistItems,
  findWishlistItem,
  addItemToWishlist,
  removeItemFromWishlist,
};
