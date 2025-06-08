import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import {
  addressesServiceQueries,
  usersServiceQueries,
} from "../utils/sqlQueries/index.js";

const findUserAddresses = async (userId) => {
  const [userExists] = await db.execute(
    usersServiceQueries.checkIfUserExistsByIdQuery,
    [userId]
  );

  checkIfResourceExists(userExists.length, "User not found");

  const query = addressesServiceQueries.findAllAddressesQuery;

  const queryParams = [userId];

  const [result] = await db.execute(query, queryParams);

  return result;
};

const createAddressService = async (addressData) => {
  const query = addressesServiceQueries.addAddressQuery;

  const queryParams = [
    addressData.userId,
    addressData.addressLine1,
    addressData.addressLine2,
    addressData.country,
    addressData.state,
    addressData.city,
    addressData.isDefault || true,
  ];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

export default { findUserAddresses, createAddressService };
