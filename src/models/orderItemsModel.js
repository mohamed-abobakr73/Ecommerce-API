const createOrderItemsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_item_id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      );
    `);
    console.log("order_items table ready");
  } catch (error) {
    console.error("order_items table error:", error);
  }
};

export default createOrderItemsTable;
