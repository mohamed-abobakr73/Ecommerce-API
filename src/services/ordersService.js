import db from "../configs/connectToDb.js";
import snakeToCamel from "../utils/snakeToCamel.js";
const findOrderId = async (userId) => {
  const [result] = await db.query(
    `SELECT order_id FROM orders WHERE user_id = ?`,
    [userId]
  );
  return result;
};

const findAllOrderItems = async (orderIds) => {
  const query = `
  SELECT 
    order_items.order_item_id as ${snakeToCamel("order_item_id")},
    order_items.order_id as ${snakeToCamel("order_id")},
    order_items.quantity,
    products.product_id as ${snakeToCamel("product_id")},
    products.product_name as ${snakeToCamel("product_name")},
    products.product_description as ${snakeToCamel("product_description")},
    products.price,
    categories.category_name as ${snakeToCamel("category_name")},
    brands.brand_name as ${snakeToCamel("brand_name")},
    images.image_path as ${snakeToCamel("image_path")}
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
  WHERE
    order_items.order_id IN (${orderIds.map(() => "?").join(", ")});
  `;

  const [result] = await db.execute(query, orderIds);
  return result;
};

const findAllOrders = async (userId) => {
  const query = `
  SELECT * FROM orders WHERE user_id = ?
  `;
  const [result] = await db.execute(query, [userId]);
  return result;
};

const findOrder = async (orderId) => {
  const query = `
  SELECT * FROM orders WHERE order_id = ?
  `;
  const [[result]] = await db.query(query, [orderId]);
  return result;
};

const createOrder = async (data) => {
  const query = `INSERT INTO orders 
    (user_id, status, total_price, discount_id) 
  VALUES
    (?,?,?,?)
  `;
  const values = Object.values(data);
  if (!values[values.length - 1]) {
    values[values.length - 1] = null;
  }
  const [result] = await db.execute(query, values);
  return result.insertId;
};

const createOrderItems = async (items) => {
  const [result] = db.query(
    `INSERT INTO order_items (order_id, product_id, quantity) VALUES ?`,
    [items]
  );
  return result.affectedRow;
};

export default {
  findAllOrders,
  findAllOrderItems,
  findOrder,
  createOrder,
  createOrderItems,
};
