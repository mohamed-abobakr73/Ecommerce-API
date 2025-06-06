import { Router } from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscount,
} from "../controllers/discountsController.js";
import discountsValidation from "../middlewares/discountsValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAllowed from "../middlewares/isAllowed.js";
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
    createDiscount
  );

export default discountsRouter;
