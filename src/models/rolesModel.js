import db from "../configs/connectToDb.js";

const createRolesTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS roles (
        role_id INT PRIMARY KEY AUTO_INCREMENT,
        role_name VARCHAR(20) NOT NULL
      );
    `);
  } catch (error) {
    console.error("roles table error:", error);
  }
};

export default createRolesTable;
