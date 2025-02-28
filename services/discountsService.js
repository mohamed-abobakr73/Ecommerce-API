import pool from "./connectToDb.js";

const findAllDiscounts = async (sellerId) => {
  const query = `
    SELECT * FROM discounts WHERE seller_id = ?
  `;
  const [result] = await pool.query(query, [sellerId]);
  return result;
};

const findDiscount = async (filters) => {
  let query = `
    SELECT * FROM discounts
  `;
  let queryParams;
  if (Object.keys(filters).length > 0) {
    const conditions = Object.keys(filters)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    query += ` WHERE ${conditions}`;
    queryParams = Object.values(filters);
  }

  const [[result]] = await pool.execute(query, queryParams);
  return result;
};

const createDiscount = async (data) => {
  const query = `
  INSERT INTO discounts
    (seller_id, code, discount_percentage, valid_from, valid_to)
  VALUES
    (?,?,?,?,?);
  `;
  const { sellerId, code, discountPercentage, validFrom, validTo } = data;
  const [result] = await pool.execute(query, [
    sellerId,
    code,
    discountPercentage,
    validFrom,
    validTo,
  ]);
  return result.affectedRows;
};

export default { findAllDiscounts, findDiscount, createDiscount };
