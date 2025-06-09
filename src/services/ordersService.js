import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import { ordersServiceQueries } from "../utils/sqlQueries/index.js";
import productsService from "./productsService.js";

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

const createOrderService = async (paymentData, products) => {
  try {
    const query = ordersServiceQueries.createOrderQuery;

    paymentData.discount = paymentData.discount || null;

    const queryParams = Object.values(paymentData);

    const [result] = await db.execute(query, queryParams);

    const orderId = result.insertId;

    const orderProducts = products.map((product) =>
      Object.values({ orderId, ...product })
    );

    const orderItems = await createOrderItemsService(orderProducts);

    const decrementedProducts =
      await productsService.decrementProductStockQuantity(products);

    return result.affectedRows;
  } catch (error) {
    console.log(error);
  }
};

const createOrderItemsService = async (orderItems) => {
  const placeholdersQuery = orderItems.map(() => "(?, ?, ?)").join(", ");

  const query = ordersServiceQueries.createOrderItemQuery(placeholdersQuery);

  const queryParams = orderItems.flat();

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "Order items not created");

  return result.affectedRows;
};

export default {
  findAllOrders,
  findAllOrderItems,
  findOrder,
  createOrderService,
  createOrderItemsService,
};
