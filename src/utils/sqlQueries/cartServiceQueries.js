import snakeToCamel from "../snakeToCamel.js";

const findCartIdQuery = `
  SELECT 
    cart_id AS ${snakeToCamel("cart_id")} 
  FROM cart 
  WHERE user_id  = ?`;

const findCartItemsQuery = `
  SELECT 
    cart_items.cart_items_id AS ${snakeToCamel("cart_items_id")},
    cart_items.cart_id AS ${snakeToCamel("cart_id")},
    cart_items.product_id AS ${snakeToCamel("product_id")},
    cart_items.quantity, 
    products.product_name AS ${snakeToCamel("product_name")},
    products.product_description AS ${snakeToCamel("product_description")},
    products.price,
    products.stock_quantity AS ${snakeToCamel("stock_quantity")},
    products.seller_id AS ${snakeToCamel("seller_id")},
    products.category_id AS ${snakeToCamel("category_id")},
    products.brand_id AS ${snakeToCamel("brand_id")},
    products.created_at AS ${snakeToCamel("created_at")}
  FROM
    cart_items
  JOIN
    products
  ON
    cart_items.product_id = products.product_id 
  WHERE
    cart_items.cart_id = ?
`;

const createUserCartQuery = `
  INSERT INTO 
    cart
      (user_id)
    values
      (?)
  `;

const updateCartItemQuantityQuery = `
  UPDATE cart_items
  SET quantity = ?
  WHERE cart_items_id = ?
`;

const deleteCartItemQuery = `
  DELETE FROM cart_items
  WHERE cart_items_id = ?
`;

export default {
  findCartIdQuery,
  findCartItemsQuery,
  createUserCartQuery,
  updateCartItemQuantityQuery,
  deleteCartItemQuery,
};
