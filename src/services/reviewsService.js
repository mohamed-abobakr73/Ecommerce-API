import db from "../configs/connectToDb.js";
import { reviewsServiceQueries } from "../utils/sqlQueries/index.js";
import { checkIfProductIsValid } from "./cartService.js";

const findAllReviewsService = async (productId) => {
  const query = reviewsServiceQueries.findAllReviewsQuery;

  checkIfProductIsValid(productId);

  const queryParams = [productId];

  const [result] = await db.execute(query, queryParams);

  return result;
};

const createReviewService = async (data) => {
  const { userId, productId, rating, reviewText } = data;

  const query = reviewsServiceQueries.createReviewQuery;

  const queryParams = [userId, productId, rating, reviewText];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

export default { findAllReviewsService, createReviewService };
