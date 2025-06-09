import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import { ordersServiceQueries } from "../utils/sqlQueries/index.js";
import productsService from "./productsService.js";

const groupOrderData = (rows) => {
  const grouped = {};

  for (const row of rows) {
    const {
      orderId,
      userId,
      status,
      totalPrice,
      discountId,
      discountPercentage,
      orderItemId,
      quantity,
      productId,
      productName,
      productDescription,
      price,
      categoryName,
      brandName,
      imagePath,
    } = row;

    if (!grouped[orderId]) {
      grouped[orderId] = {
        orderId,
        userId,
        status,
        totalPrice,
        discountId: discountId || "No discount",
        discountPercentage: discountPercentage + "%" || 0,
        items: [],
      };
    }

    grouped[orderId].items.push({
      orderItemId,
      quantity,
      productId,
      productName,
      productDescription,
      price,
      categoryName,
      brandName,
      imagePath,
    });
  }

  return Object.values(grouped);
};

const findAllOrdersService = async (userId) => {
  const query = ordersServiceQueries.findOrdersQuery;

  const queryParams = [userId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.length, "Orders not found");

  const ordersData = groupOrderData(result);

  return ordersData;
};

const findOrderService = async (orderId) => {
  const query = ordersServiceQueries.findOrderQuery;

  const queryParams = [orderId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.length, "Order not found");

  const orderData = groupOrderData(result)[0];

  return orderData;
};

const createOrderService = async (paymentData, products) => {
  try {
    const query = ordersServiceQueries.createOrderQuery;

    paymentData.discount = paymentData.discount || null;

    const queryParams = Object.values(paymentData);

    const [result] = await db.execute(query, queryParams);

    checkIfResourceExists(result.affectedRows, "Order not created");

    const orderId = result.insertId;

    const orderProducts = products.map((product) =>
      Object.values({ orderId, ...product })
    );

    await createOrderItemsService(orderProducts);

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
  findAllOrdersService,
  findOrderService,
  createOrderService,
  createOrderItemsService,
};
