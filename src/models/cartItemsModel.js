import db from "../configs/connectToDb";

const createCartItemsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        cart_items_id INT PRIMARY KEY AUTO_INCREMENT,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      );
    `);
  } catch (error) {
    console.error("cart_items table error:", error);
  }
};

export default createCartItemsTable;
