import snakeToCamel from "../snakeToCamel.js";

const findOrderItemsQuery = `
  SELECT 
  order_items.order_item_id AS ${snakeToCamel("order_item_id")},
  order_items.order_id AS ${snakeToCamel("order_id")},
  order_items.quantity,
  products.product_id AS ${snakeToCamel("product_id")},
  products.product_name AS ${snakeToCamel("product_name")},
  products.product_description AS ${snakeToCamel("product_description")},
  products.price,
  categories.category_name AS ${snakeToCamel("category_name")},
  brands.brand_name AS ${snakeToCamel("brand_name")},
  images.image_path AS ${snakeToCamel("image_path")}
  FROM 
    orders 
  JOIN 
    order_items ON orders.order_id = order_items.order_id
  JOIN 
    products ON order_items.product_id = products.product_id
  JOIN 
    categories ON products.category_id = categories.category_id
  JOIN 
    brands ON products.brand_id = brands.brand_id
  JOIN
    images ON products.product_image = images.image_id
`;

const findOrdersQuery = (whereClause) => {
  return `
    SELECT 
      order_id AS ${snakeToCamel("order_id")},
      user_id AS ${snakeToCamel("user_id")},
      status,
      total_price AS ${snakeToCamel("total_price")},
      discount_id AS ${snakeToCamel("discount_id")},
      created_at AS ${snakeToCamel("created_at")}
    FROM 
      orders
    ${whereClause}
`;
};

const createOrderQuery = `
  INSERT INTO orders
    (user_id, status, total_price, discount_id)
  VALUES
    (?,?,?,?)
`;

const createOrderItemQuery = `
  INSERT INTO order_items
    (order_id, product_id, quantity)
  VALUES
    (?,?,?)
`;

export default {
  findOrdersQuery,
  findOrderItemsQuery,
  createOrderQuery,
  createOrderItemQuery,
};
