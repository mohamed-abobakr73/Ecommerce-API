import db from "../configs/connectToDb.js";

const createDiscountsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS discounts (
        discount_id INT PRIMARY KEY AUTO_INCREMENT,
        seller_id INT NOT NULL,
        code VARCHAR(50) NOT NULL,
        discount_percentage DECIMAL(4,2) NOT NULL,
        valid_from DATETIME NOT NULL,
        valid_to DATETIME NOT NULL
      );
    `);
  } catch (error) {
    console.error("discounts table error:", error);
  }
};

export default createDiscountsTable;
