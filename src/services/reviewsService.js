import pool from "./connectToDb.js";

const findAllReviews = async (productId) => {
  const query = `
  SELECT 
    review_id AS reviewId,
    user_id AS userId,
    product_id AS productId,
    rating,
    review_text AS reviewText,
    created_at AS createdAt
  FROM
      reviews
  WHERE
    product_id = 1;

  `;

  const [result] = await pool.query(query, [productId]);
  return result;
};

const addReview = async (data) => {
  const { userId, productId, rating, reveiwText } = data;
  const query = `
  INSERT INTO
    reviews 
      (user_id, product_id, rating, review_text) 
    VALUES 
      (?, ?, ?, ?);
`;
  const [result] = await pool.query(query, [
    userId,
    productId,
    rating,
    reveiwText,
  ]);
  return result.affectedRows;
};

export default { findAllReviews, addReview };
