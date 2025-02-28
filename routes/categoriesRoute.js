import { Router } from "express";
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";
import categoriesBrandsValidation from "../middlewares/categoriesBrandsValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAllowed from "../middlewares/isAllowed.js";
import usersRoles from "../utils/usersRoles.js";

const categoriesRouter = Router();

categoriesRouter.route("/").get(getAllCategories);
categoriesRouter.route("/:categoryId").get(getCategory);

categoriesRouter
  .route("/")
  .post(
    verifyToken,
    isAllowed(usersRoles.ADMIN),
    categoriesBrandsValidation("category"),
    createCategory
  );

categoriesRouter
  .route("/:categoryId")
  .patch(verifyToken, isAllowed(usersRoles.ADMIN), updateCategory);

categoriesRouter
  .route("/:categoryId")
  .delete(verifyToken, isAllowed(usersRoles.ADMIN), deleteCategory);

export default categoriesRouter;
