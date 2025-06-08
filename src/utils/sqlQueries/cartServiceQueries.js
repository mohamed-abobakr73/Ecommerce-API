import snakeToCamel from "../snakeToCamel.js";

const findCartIdQuery = `
  SELECT 
    cart_id AS ${snakeToCamel("cart_id")} 
  FROM cart 
  WHERE user_id  = ?`;

const addCartItemQuery = `
  INSERT INTO cart_items
    (cart_id, product_id, quantity)
  VALUES
    (?, ?, ?)
  `;

const findCartItemsQuery = `
  SELECT 
    cart_items.cart_items_id AS ${snakeToCamel("cart_item_id")},
    cart_items.cart_id AS ${snakeToCamel("cart_id")},
    cart_items.product_id AS ${snakeToCamel("product_id")},
    cart_items.quantity, 
    
    products.product_name AS ${snakeToCamel("product_name")},
    products.product_description AS ${snakeToCamel("product_description")},
    products.price,
    products.stock_quantity AS ${snakeToCamel("stock_quantity")},
    products.created_at AS ${snakeToCamel("created_at")},

    brands.brand_name AS ${snakeToCamel("brand_name")},

    categories.category_name AS ${snakeToCamel("category_name")},

    images.image_path AS ${snakeToCamel("image_path")},

    users.first_name AS ${snakeToCamel("first_name")},
    users.last_name AS ${snakeToCamel("last_name")},
    users.email,
    users.phone,
    roles.role_name AS ${snakeToCamel("role_name")}
  FROM
    cart_items
  JOIN
    products
  ON
    cart_items.product_id = products.product_id
  JOIN
    images ON products.product_image = images.image_id
  JOIN
    categories ON products.category_id = categories.category_id
  JOIN
    brands ON products.brand_id = brands.brand_id
  JOIN
    users ON products.seller_id = users.user_id
  JOIN
    roles ON users.role_id = roles.role_id
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
  addCartItemQuery,
  updateCartItemQuantityQuery,
  deleteCartItemQuery,
};
