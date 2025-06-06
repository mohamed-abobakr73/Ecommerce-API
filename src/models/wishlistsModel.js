import db from "../configs/connectToDb.js";

const createWishListsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      );
    `);
  } catch (error) {
    console.error("wishlist table error:", error);
  }
};

export default createWishListsTable;
