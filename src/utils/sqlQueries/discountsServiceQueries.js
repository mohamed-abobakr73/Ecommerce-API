import snakeToCamel from "../snakeToCamel.js";

const findDiscountsFields = `
  SELECT 
    discount_id AS ${snakeToCamel("discount_id")},
    seller_id AS ${snakeToCamel("seller_id")},
    code,
    discount_percentage AS ${snakeToCamel("discount_percentage")},
    valid_from AS ${snakeToCamel("valid_from")},
    valid_to AS ${snakeToCamel("valid_to")}
  FROM 
    discounts
`;

const findAllDiscountQuery = `
  ${findDiscountsFields}
  WHERE
    seller_id = ?
`;

const findDiscountQuery = `
  ${findDiscountsFields}
  WHERE
    discount_id = ?
`;

const createDiscountQuery = `
  INSERT INTO discounts
    (seller_id, code, discount_percentage, valid_from, valid_to)
  VALUES
    (?,?,?,?,?);
`;

export default { findAllDiscountQuery, findDiscountQuery, createDiscountQuery };
