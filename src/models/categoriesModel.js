import db from "../configs/connectToDb";

const createCategoriesTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        category_name VARCHAR(50) NOT NULL
      );
    `);
  } catch (error) {
    console.error("categories table error:", error);
  }
};

export default createCategoriesTable;
