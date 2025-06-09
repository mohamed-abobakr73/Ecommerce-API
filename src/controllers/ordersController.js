import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import httpStatusText from "../utils/httpStatusText.js";
import ordersService from "../services/ordersService.js";

const getAllOrders = asyncWrapper(async (req, res, next) => {
  const { userId } = req.query;

  const orders = await ordersService.findAllOrdersService(userId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { orders } });
});

const getOrder = asyncWrapper(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await ordersService.findOrderService(orderId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { order } });
});

export { getAllOrders, getOrder };
