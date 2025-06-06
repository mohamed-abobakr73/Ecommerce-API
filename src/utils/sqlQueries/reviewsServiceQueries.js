import snakeToCamel from "../snakeToCamel.js";

const findAllReviewsQuery = `
  SELECT 
    review_id AS ${snakeToCamel("review_id")},
    user_id AS ${snakeToCamel("user_id")},
    product_id AS ${snakeToCamel("product_id")},
    rating,
    review_text AS ${snakeToCamel("review_text")},
    created_at AS ${snakeToCamel("created_at")}
  FROM
    reviews
  WHERE
    product_id = ?;
`;

const createReviewQuery = `
  INSERT INTO
    reviews 
      (user_id, product_id, rating, review_text) 
    VALUES 
      (?, ?, ?, ?);
`;

export default { findAllReviewsQuery, createReviewQuery };
