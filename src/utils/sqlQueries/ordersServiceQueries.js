import snakeToCamel from "../snakeToCamel.js";

const orderQuery = `
  SELECT 
    orders.order_id AS ${snakeToCamel("order_id")},
    orders.user_id AS ${snakeToCamel("user_id")},
    orders.status,
    orders.total_price AS ${snakeToCamel("total_price")},
    orders.discount_id AS ${snakeToCamel("discount_id")},
    discounts.discount_percentage AS ${snakeToCamel("discount_percentage")},
    orders.created_at AS ${snakeToCamel("created_at")},
    order_items.order_item_id AS orderItemId,
    order_items.quantity,

    products.product_id AS productId,
    products.product_name AS productName,
    products.product_description AS productDescription,
    products.price,

    categories.category_name AS categoryName,
    brands.brand_name AS brandName,
    images.image_path AS imagePath

  FROM 
    orders 
  JOIN 
    order_items ON orders.order_id = order_items.order_id
  LEFT JOIN
    discounts ON orders.discount_id = discounts.discount_id
  JOIN 
    products ON order_items.product_id = products.product_id
  JOIN 
    categories ON products.category_id = categories.category_id
  JOIN 
    brands ON products.brand_id = brands.brand_id
  JOIN
    images ON products.product_image = images.image_id
`;

const findOrdersQuery = `
  ${orderQuery}

  WHERE orders.user_id = ?
  ORDER BY orders.order_id DESC;
`;

const findOrderQuery = `
    ${orderQuery}

    WHERE order_items.order_id = ?
`;

const createOrderQuery = `
  INSERT INTO orders
    (user_id, status, total_price, discount_id)
  VALUES
    (?,?,?,?)
`;

const createOrderItemQuery = (placeholders) => {
  return `
    INSERT INTO order_items
      (order_id, product_id, quantity)
    VALUES
      ${placeholders}
`;
};

export default {
  findOrderQuery,
  findOrdersQuery,
  createOrderQuery,
  createOrderItemQuery,
};
