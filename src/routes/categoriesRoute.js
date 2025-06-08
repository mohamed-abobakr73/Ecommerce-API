import { Router } from "express";
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";
import {
  categoriesBrandsValidation,
  verifyToken,
  isAllowed,
  validateRequestBody,
} from "../middlewares/index.js";
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
    validateRequestBody,
    createCategory
  );

categoriesRouter
  .route("/:categoryId")
  .patch(
    verifyToken,
    isAllowed(usersRoles.ADMIN),
    categoriesBrandsValidation("category"),
    validateRequestBody,
    updateCategory
  );

categoriesRouter
  .route("/:categoryId")
  .delete(verifyToken, isAllowed(usersRoles.ADMIN), deleteCategory);

export default categoriesRouter;
