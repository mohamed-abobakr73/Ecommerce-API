import db from "../configs/connectToDb.js";

const createBrandsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS brands (
        brand_id INT PRIMARY KEY AUTO_INCREMENT,
        brand_name VARCHAR(50) NOT NULL
      );
    `);
  } catch (error) {
    console.error("brands table error:", error);
  }
};

export default createBrandsTable;
