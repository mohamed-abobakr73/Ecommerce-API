import db from "../configs/connectToDb.js";

const createOrdersTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        status ENUM('Pending', 'Shipped', 'Delivered', 'Canceled', 'Processing') NOT NULL,
        total_price DECIMAL(6,2) NOT NULL,
        discount_id INT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
      );
    `);
  } catch (error) {
    console.error("orders table error:", error);
  }
};

export default createOrdersTable;
