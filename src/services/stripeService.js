import Stripe from "stripe";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import productsService from "./productsService.js";
import discountsService from "./discountsService.js";

const checkAndCreateDiscount = async (discountCode) => {
  if (discountCode) {
    const discount = await discountsService.findDiscountService(discountCode);

    if (!discount) {
      const error = new AppError(
        "Invalid discount code",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }

    return discount;
  }
};

const validateProductsIds = async (products) => {
  const productsIds = products.map((product) => product.id);

  const productsInfo = await productsService.findProductsByIdsService(
    productsIds
  );

  const validProductsIds = productsInfo.map((product) => product.productId);

  const invalidProductsIds = productsIds.filter(
    (id) => !validProductsIds.includes(id)
  );

  if (invalidProductsIds.length > 0) {
    const errorMessage = `
      Invalid product id${
        invalidProductsIds.length > 1 ? "s" : ""
      } ${invalidProductsIds.join(", ")}
    `;

    const error = new AppError(errorMessage, 400, httpStatusText.ERROR);
    throw error;
  }

  return productsInfo;
};

const createStripeLineItems = (productsData, productsQuantity) => {
  const orderProducts = productsData.map((product, idx) => ({
    name: product.productName,
    price: product.price,
    image: product.imagePath,
    quantity: productsQuantity[idx].quantity,
  }));

  const stripeLineItems = orderProducts.map((product) => {
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
  });

  return stripeLineItems;
};

const createStripeSession = async (paymentData) => {
  const { stripe, stripeLineItems, coupon, products, userId, discountData } =
    paymentData;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: stripeLineItems,
    discounts: coupon ? [{ coupon: coupon.id }] : undefined,
    success_url: `https://www.google.com`,
    cancel_url: `https://www.youtube.com`,
    metadata: {
      userId,
      discount: discountData ? discountData.discountId : null,
      products: JSON.stringify(products),
    },
  });

  return session;
};

const stripePaymentService = async (paymentData) => {
  const { products, userId, discount } = paymentData;

  let coupon;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const discountData = await checkAndCreateDiscount(discount);

  if (discountData) {
    coupon = await stripe.coupons.create({
      percent_off: +discountData.discountPercentage, // Or use "amount_off" for fixed discounts
      duration: "once", // Options: 'once', 'repeating', 'forever'
    });
  }

  const productsData = await validateProductsIds(products);

  const stripeLineItems = createStripeLineItems(productsData, products);

  const session = await createStripeSession({
    stripe,
    stripeLineItems,
    coupon,
    products,
    userId,
    discountData,
  });

  return session.url;
};

export default { stripePaymentService };
