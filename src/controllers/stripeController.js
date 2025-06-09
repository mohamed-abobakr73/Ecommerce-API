import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import dotenv from "dotenv";
import productsService from "../services/productsService.js";
import ordersService from "../services/ordersService.js";
import httpStatusText from "../utils/httpStatusText.js";
import stripeService from "../services/stripeService.js";

dotenv.config(); // To read from env files.

const stripePayment = asyncWrapper(async (req, res, next) => {
  const validatedData = req.body;

  const sessionUrl = await stripeService.stripePaymentService(validatedData);

  res.status(201).json({ status: httpStatusText.SUCCESS, url: sessionUrl });
});

const stripeWebHook = asyncWrapper(async (req, res, next) => {
  const event = req.body;
  console.log(event);
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const orderData = {
        userId: +session.metadata.userId,
        status: "Processing",
        totalPrice: session.amount_total / 100,
        discount: session.metadata.discount,
      };

      const orderId = await ordersService.createOrder(orderData);
      const sessionProducts = JSON.parse(session.metadata.products);
      const orderProducts = sessionProducts.map((product) =>
        Object.values({ orderId, ...product })
      );

      const orderItems = await ordersService.createOrderItems(orderProducts);
      const decrementedProducts =
        await productsService.decrementProductStockQuantity(sessionProducts);
      break;
    default:
    // console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export { stripePayment, stripeWebHook };
