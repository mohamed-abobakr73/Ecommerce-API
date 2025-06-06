import db from "../configs/connectToDb";

const createAddressesTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        address_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        address_line_1 VARCHAR(100) NOT NULL,
        address_line_2 VARCHAR(100),
        country VARCHAR(30) NOT NULL,
        state VARCHAR(30) NOT NULL,
        city VARCHAR(30) NOT NULL,
        is_default BOOLEAN,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);
  } catch (error) {
    console.error("addresses table error:", error);
  }
};

export default createAddressesTable;
