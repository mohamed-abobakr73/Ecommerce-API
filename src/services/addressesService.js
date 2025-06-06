import db from "../configs/connectToDb.js";
import { addressesServiceQueries } from "../utils/sqlQueries/index.js";

const findAllAddresses = async (userId) => {
  const query = addressesServiceQueries.findAllAddressesQuery;

  const [result] = await db.execute(query, [userId]);

  return result;
};

const addAddress = async (addressData) => {
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

  const [result] = await db.query(query, queryParams);

  return result.affectedRows;
};

export default { findAllAddresses, addAddress };
