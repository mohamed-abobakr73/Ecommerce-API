import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/producutsController.js";
import productValidation from "../middlewares/productValidation.js";
import upload from "../configs/cloudinaryConfig.js";
import imageValidation from "../middlewares/imageValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAllowed from "../middlewares/isAllowed.js";
import usersRoles from "../utils/usersRoles.js";

const productsRouter = Router();

productsRouter.route("/").get(getAllProducts);
productsRouter.route("/:productId").get(getProduct);

productsRouter
  .route("/")
  .post(
    verifyToken,
    isAllowed(usersRoles.SELLER, usersRoles.ADMIN),
    upload.single("image"),
    productValidation(),
    imageValidation,
    createProduct
  );

productsRouter
  .route("/:productId")
  .patch(
    verifyToken,
    isAllowed(usersRoles.SELLER, usersRoles.ADMIN),
    upload.single("image"),
    productValidation(),
    updateProduct
  );

productsRouter
  .route("/:productId")
  .delete(
    verifyToken,
    isAllowed(usersRoles.SELLER, usersRoles.ADMIN),
    deleteProduct
  );

export default productsRouter;
