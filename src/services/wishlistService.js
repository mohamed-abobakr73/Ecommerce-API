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

const addOrRemoveItemToWishlistService = async (operation, data) => {
  const { userId, productId } = data;

  let query;

  switch (operation) {
    case "add":
      query = wishlistServiceQueries.addItemToWishlistQuery;
      break;
    case "remove":
      query = wishlistServiceQueries.deleteItemFromWishlistQuery;
      break;
  }

  const queryParams = [userId, productId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(
    result.affectedRows,
    operation === "add"
      ? "Item not added to wishlist"
      : "Item not removed from wishlist"
  );

  return result.affectedRows;
};

export default {
  getAllWishlistItemsService,
  findWishlistItemService,
  addOrRemoveItemToWishlistService,
};
