import db from "../configs/connectToDb";

const createPaymentsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        amount_paid DECIMAL(8,2) NOT NULL,
        payment_method ENUM('credit card', 'bank transfer', 'paypal') NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed') NOT NULL,
        payment_date DATETIME NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
      );
    `);
  } catch (error) {
    console.error("payments table error:", error);
  }
};

export default createPaymentsTable;
