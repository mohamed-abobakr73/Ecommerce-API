import express from "express";
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
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "3mb" }));
app.use(morgan("dev"));

// Initialize database
initializeDatabase();

// Routes
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/stripe", stripeRouter);
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
