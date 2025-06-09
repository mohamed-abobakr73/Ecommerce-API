import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import dotenv from "dotenv";
import ordersService from "../services/ordersService.js";
import httpStatusText from "../utils/httpStatusText.js";
import stripeService from "../services/stripeService.js";
import Stripe from "stripe";

dotenv.config(); // To read from env files.

const stripePayment = asyncWrapper(async (req, res, next) => {
  const validatedData = req.body;

  const sessionUrl = await stripeService.stripePaymentService(validatedData);

  res.status(201).json({ status: httpStatusText.SUCCESS, url: sessionUrl });
});

const stripeWebHook = asyncWrapper(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      const orderData = {
        userId: +session.metadata.userId,
        status: "Processing",
        totalPrice: session.amount_total / 100,
        discount: session.metadata.discount,
      };

      const sessionProducts = JSON.parse(session.metadata.products);

      await ordersService.createOrderService(orderData, sessionProducts);

      break;
    default:
    // console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export { stripePayment, stripeWebHook };
