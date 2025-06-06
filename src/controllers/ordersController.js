import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { check, validationResult } from "express-validator";
import cartService from "../services/cartService.js";
import productsService from "../services/productsService.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import ordersService from "../services/ordersService.js";
import checkIfUserExists from "../utils/checkIfUserExists.js";

const getAllOrders = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;
  const userExists = await checkIfUserExists(userId);
  if (userExists) {
    return next(userExists);
  }

  const orders = await ordersService.findAllOrders(userId);
  const orderIds = orders.map((order) => order.order_id);
  const allOrderItems = await ordersService.findAllOrderItems(orderIds);
  console.log(allOrderItems);
  const combinedOrders = orders.map((order) => {
    return {
      orderInfo: order,
      orderItems: allOrderItems
        .filter((item) => item.orderId === order.order_id)
        .map((item) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          product: {
            productId: item.productId,
            productName: item.productName,
            productDescription: item.productDescription,
            price: item.price,
            categoryName: item.categoryName,
            brandName: item.brandName,
            imagePath: item.imagePath,
          },
        })),
    };
  });
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { orders: combinedOrders } });
});

const getOrder = asyncWrapper(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await ordersService.findOrder(orderId);
  if (!order) {
    const error = new AppError("Invalid order id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const orderItems = await ordersService.findAllOrderItems([orderId]);
  const orderData = {
    orderInfo: order,
    orderItems: orderItems.map((item) => {
      return {
        orderItemId: item.orderItemId,
        quantity: item.quantity,
        product: {
          productId: item.productId,
          productName: item.productName,
          productDescription: item.productDescription,
          price: item.price,
          categoryName: item.categoryName,
          brandName: item.brandName,
          imagePath: item.imagePath,
        },
      };
    }),
  };

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { orderData } });
});

export { getAllOrders, getOrder };
