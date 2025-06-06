import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { validationResult } from "express-validator";
import Stripe from "stripe";
import dotenv from "dotenv";
import productsService from "../services/productsService.js";
import ordersService from "../services/ordersService.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import checkIfUserExists from "../utils/checkIfUserExists.js";
import discountsService from "../services/discountsService.js";

dotenv.config(); // To read from env files.

const stripePayment = asyncWrapper(async (req, res, next) => {
  const { products, userId, discount } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError(errors.array(), 400, httpStatusText.ERROR);
    return next(error);
  }

  const userDoNotExist = await checkIfUserExists(userId);
  if (userDoNotExist) {
    const error = new AppError("Invalid user id", 400, httpStatusText.ERROR);
    return next(error);
  }

  let coupon;
  const stripe = new Stripe(process.env.STIRPE_SECRET_KEY);

  let discountData;
  if (discount) {
    discountData = await discountsService.findDiscount({
      code: discount,
    });

    if (!discountData) {
      const error = new AppError(
        "Invalid discount code",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    coupon = await stripe.coupons.create({
      percent_off: discountData.discount_percentage, // Or use "amount_off" for fixed discounts
      duration: "once", // Options: 'once', 'repeating', 'forever'
    });
  }

  const productsIds = products.map((product) => product.id);
  const productsInfo = await productsService.findProductsByIds(productsIds);

  const validProductsIds = productsInfo.map((product) => product.productId);
  const invalidProductsIds = productsIds.filter(
    (id) => !validProductsIds.includes(id)
  );

  if (invalidProductsIds.length > 0) {
    const error = new AppError(
      `Invalid product id${
        invalidProductsIds.length > 1 ? "s" : ""
      } ${invalidProductsIds.join(", ")}`,
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }

  const orderProducts = productsInfo.map((product, idx) => ({
    name: product.productName,
    price: product.price,
    image: product.imagePath,
    quantity: products[idx].quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: orderProducts.map((product) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      };
    }),
    discounts: coupon ? [{ coupon: coupon.id }] : undefined,
    success_url: `https://www.google.com`,
    cancel_url: `https://www.youtube.com`,
    metadata: {
      userId,
      discount: discountData ? discountData.discount_id : null,
      products: JSON.stringify(products),
    },
  });

  res.json({ url: session.url });
});

const stripeWebHook = asyncWrapper(async (req, res, next) => {
  const event = req.body;

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
