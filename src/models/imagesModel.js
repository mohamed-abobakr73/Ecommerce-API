import db from "../configs/connectToDb.js";

const createImagesTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS images (
        image_id INT PRIMARY KEY AUTO_INCREMENT,
        image_path VARCHAR(255) NOT NULL
      );
    `);
  } catch (error) {
    console.error("images table error:", error);
  }
};

export default createImagesTable;
