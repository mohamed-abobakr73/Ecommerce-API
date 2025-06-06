import db from "../configs/connectToDb.js";
import { reviewsServiceQueries } from "../utils/sqlQueries/index.js";

const findAllReviews = async (productId) => {
  const query = reviewsServiceQueries.findAllReviewsQuery;

  const queryParams = [productId];

  const [result] = await db.execute(query, queryParams);

  return result;
};

const addReview = async (data) => {
  const { userId, productId, rating, reviewText } = data;

  const query = reviewsServiceQueries.createReviewQuery;

  const queryParams = [userId, productId, rating, reviewText];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

export default { findAllReviews, addReview };
