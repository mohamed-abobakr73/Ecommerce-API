import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import httpStatusText from "./utils/httpStatusText.js";
import usersRouter from "./routes/usersRoute.js";
import categoriesRouter from "./routes/categoriesRoute.js";
import brandsRouter from "./routes/brandsRoute.js";
import productsRouter from "./routes/productsRoute.js";
import cartRouter from "./routes/cartsRoute.js";
import stripeRouter from "./routes/stripeRoute.js";
import ordersRouter from "./routes/ordersRoute.js";
import discountsRouter from "./routes/discountsRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import reviewsRouter from "./routes/reviewsRoute.js";
import addressesRouter from "./routes/addressesRoute.js";

const app = express();

dotenv.config(); // To read from env files.

app.use(cors()); // To enable cors for all website and this should be modified on production.

app.use(express.json()); // Parsing request body to json format.

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
// app.use((error, req, res, next) => {
//   res.status(error.statusCode || 500).json({
//     status: error.statusText || httpStatusText.ERROR,
//     message: error.message,
//     code: error.statusCode || 500,
//     data: null,
//   });
// });

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
