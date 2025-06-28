import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };
import cors from "cors";
import dotenv from "dotenv";
import initializeDatabase from "./configs/initializeDatabase.js";
import {
  usersRouter,
  categoriesRouter,
  brandsRouter,
  productsRouter,
  cartRouter,
  stripeRouter,
  ordersRouter,
  discountsRouter,
  wishlistRouter,
  reviewsRouter,
  addressesRouter,
} from "./routes/index.js";
import morgan from "morgan";
import { globalErrorHandler } from "./middlewares/index.js";
import { stripeWebHook } from "./controllers/stripeController.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "3mb" }));
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebHook
);
app.use(express.json());
app.use(morgan("dev"));
// Initialize database
initializeDatabase();

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/stripe", express.raw({ type: "application/json" }), stripeRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/discounts", discountsRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/addresses", addressesRouter);

// Error handler
app.use(globalErrorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
