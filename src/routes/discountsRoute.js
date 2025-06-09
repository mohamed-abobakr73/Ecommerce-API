import { Router } from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscount,
} from "../controllers/discountsController.js";
import {
  discountsValidation,
  verifyToken,
  isAllowed,
  validateRequestBody,
} from "../middlewares/index.js";
import usersRoles from "../utils/usersRoles.js";

const discountsRouter = Router();

discountsRouter
  .route("/")
  .get(
    verifyToken,
    isAllowed(usersRoles.SELLER, usersRoles.ADMIN),
    getAllDiscounts
  );

discountsRouter
  .route("/:discountId")
  .get(
    verifyToken,
    isAllowed(usersRoles.SELLER, usersRoles.ADMIN),
    getDiscount
  );

discountsRouter
  .route("/")
  .post(
    verifyToken,
    isAllowed(usersRoles.SELLER, usersRoles.ADMIN),
    discountsValidation(),
    validateRequestBody,
    createDiscount
  );

export default discountsRouter;
