import db from "../configs/connectToDb.js";

const createProductsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INT PRIMARY KEY AUTO_INCREMENT,
        product_name VARCHAR(50) NOT NULL,
        product_description TEXT NOT NULL,
        price DECIMAL(6,2) NOT NULL,
        stock_quantity INT NOT NULL,
        seller_id INT NOT NULL,
        category_id INT NOT NULL,
        brand_id INT NOT NULL,
        product_image INT NOT NULL,
        created_at DATE NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
        FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
        FOREIGN KEY (product_image) REFERENCES images(image_id)
      );
    `);
  } catch (error) {
    console.error("products table error:", error);
  }
};

export default createProductsTable;
