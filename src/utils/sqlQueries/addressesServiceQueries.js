const findAllAddressesQuery = `
  SELECT * FROM addresses
  WHERE user_id = ?
`;

const addAddressQuery = `
  INSERT INTO 
  addresses
    (user_id, address_line_1, address_line_2, country, state, city, is_default)
  VALUES
    (?, ?, ?, ?, ?, ?, ?)
`;

export default { findAllAddressesQuery, addAddressQuery };
