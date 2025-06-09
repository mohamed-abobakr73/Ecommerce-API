import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import {
  discountsServiceQueries,
  usersServiceQueries,
} from "../utils/sqlQueries/index.js";

// TODO FIX the find discount query and logic

const checkIfSellerExists = async (sellerId) => {
  const checkIfUserExistsQuery = usersServiceQueries.checkIfUserExistsByIdQuery;

  const [user] = await db.execute(checkIfUserExistsQuery, [sellerId]);

  checkIfResourceExists(user.length, "Seller not found");
};

const findAllDiscountsService = async (sellerId) => {
  const query = discountsServiceQueries.findAllDiscountQuery;

  await checkIfSellerExists(sellerId);

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

const createDiscountService = async (discountData) => {
  const { sellerId, code, discountPercentage, validFrom, validTo } =
    discountData;

  await checkIfSellerExists(sellerId);

  const query = discountsServiceQueries.createDiscountQuery;

  const queryParams = [sellerId, code, discountPercentage, validFrom, validTo];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "Discount not created");

  return result.affectedRows;
};

export default { findAllDiscountsService, findDiscount, createDiscountService };
