import db from "../configs/connectToDb.js";

const createCartTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart (
        cart_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);
  } catch (error) {
    console.error("cart table error:", error);
  }
};

export default createCartTable;
