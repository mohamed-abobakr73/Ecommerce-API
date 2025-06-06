import db from "../configs/connectToDb.js";

const createUsersTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        email VARCHAR(50) UNIQUE,
        phone VARCHAR(20) NOT NULL,
        joined_at DATE NOT NULL,
        confirmed BOOLEAN,
        role_id INT NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
      );
    `);
  } catch (error) {
    console.error("users table error:", error);
  }
};

export default createUsersTable;
