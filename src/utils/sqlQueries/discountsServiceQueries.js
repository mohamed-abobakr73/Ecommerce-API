import snakeToCamel from "../snakeToCamel.js";
// TODO FIX the find discount query and logic

const findAllDiscountQuery = `
  SELECT 
    discount_id AS ${snakeToCamel("discount_id")},
    seller_id AS ${snakeToCamel("seller_id")},
    code,
    discount_percentage AS ${snakeToCamel("discount_percentage")},
    valid_from AS ${snakeToCamel("valid_from")},
    valid_to AS ${snakeToCamel("valid_to")}
  FROM 
    discounts
  WHERE
    seller_id = ?
`;

const createDiscountQuery = `
  INSERT INTO discounts
    (seller_id, code, discount_percentage, valid_from, valid_to)
  VALUES
    (?,?,?,?,?);
`;

export default { findAllDiscountQuery, createDiscountQuery };
