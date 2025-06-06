import db from "../configs/connectToDb.js";
import { discountsServiceQueries } from "../utils/sqlQueries/index.js";

// TODO FIX the find discount query and logic

const findAllDiscounts = async (sellerId) => {
  const query = discountsServiceQueries.findDiscountsQuery;

  const queryParams = [sellerId];

  const [result] = await db.execute(query, queryParams);

  return result;
};

const findDiscount = async (filters) => {
  let query = discountsServiceQueries.findDiscountsQuery;

  let queryParams;

  if (Object.keys(filters).length > 0) {
    const conditions = Object.keys(filters)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    query += ` WHERE ${conditions}`;
    queryParams = Object.values(filters);
  }

  const [[result]] = await db.execute(query, queryParams);
  return result;
};

const createDiscount = async (data) => {
  const { sellerId, code, discountPercentage, validFrom, validTo } = data;

  const query = discountsServiceQueries.createDiscountQuery;

  const queryParams = [sellerId, code, discountPercentage, validFrom, validTo];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

export default { findAllDiscounts, findDiscount, createDiscount };
