import db from "../configs/connectToDb.js";

const createReviewsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        review_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating INT NOT NULL,
        review_text TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      );
    `);
  } catch (error) {
    console.error("reviews table error:", error);
  }
};

export default createReviewsTable;
