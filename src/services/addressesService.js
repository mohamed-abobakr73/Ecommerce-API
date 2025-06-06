import pool from "../configs/connectToDb.js";

const findAllAddresses = async (userId) => {
  const query = `
    SELECT * FROM addresses WHERE user_id = ?
  `;
  const [result] = await pool.query(query, [userId]);
  return result;
};

const addAddress = async (data) => {
  const {
    userId,
    addressLine1,
    addressLine2,
    country,
    state,
    city,
    isDefault,
  } = data;

  const query = `
    INSERT INTO 
    addresses
      (user_id, address_line_1, address_line_2, country, state, city, is_default)
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    userId,
    addressLine1,
    addressLine2,
    country,
    state,
    city,
    isDefault || true,
  ]);

  return result.affectedRows;
};

export default { findAllAddresses, addAddress };
