import db from "../configs/connectToDb.js";
import { ordersServiceQueries } from "../utils/sqlQueries/index.js";

const findOrderId = async (userId) => {
  const [result] = await db.query(
    `SELECT order_id FROM orders WHERE user_id = ?`,
    [userId]
  );
  return result;
};

const findAllOrderItems = async (orderIds) => {
  const query =
    ordersServiceQueries.findOrderItemsQuery +
    `WHERE
    order_items.order_id IN (${orderIds.map(() => "?").join(", ")});`;

  const [result] = await db.execute(query, orderIds);

  return result;
};

const findAllOrders = async (userId) => {
  const query = ordersServiceQueries.findOrdersQuery(`WHERE user_id = ?`);

  const queryParams = [userId];

  const [result] = await db.execute(query, queryParams);

  return result;
};

const findOrder = async (orderId) => {
  const query = ordersServiceQueries.findOrdersQuery(`WHERE order_id = ?`);

  const queryParams = [orderId];

  const [[result]] = await db.execute(query, queryParams);

  return result;
};

const createOrder = async (data) => {
  const query = ordersServiceQueries.createOrderQuery;

  const values = Object.values(data);

  if (!values[values.length - 1]) {
    values[values.length - 1] = null;
  }

  const [result] = await db.execute(query, values);

  return result.insertId;
};

const createOrderItems = async (items) => {
  const query = ordersServiceQueries.createOrderItemQuery;

  const queryParams = [items];

  const [result] = db.execute(query, queryParams);

  return result.affectedRow;
};

export default {
  findAllOrders,
  findAllOrderItems,
  findOrder,
  createOrder,
  createOrderItems,
};
