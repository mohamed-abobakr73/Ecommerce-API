import { Router } from "express";
import { getAllOrders, getOrder } from "../controllers/ordersController.js";

const ordersRouter = Router();

ordersRouter.route("/").get(getAllOrders);
ordersRouter.route("/:orderId").get(getOrder);

export default ordersRouter;
