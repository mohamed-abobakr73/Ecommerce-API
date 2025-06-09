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

const findDiscountService = async (discountId) => {
  const query = discountsServiceQueries.findDiscountQuery;

  const queryParams = [discountId];

  const [[result]] = await db.execute(query, queryParams);

  checkIfResourceExists(result, "Discount not found");

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

export default {
  findAllDiscountsService,
  findDiscountService,
  createDiscountService,
};
