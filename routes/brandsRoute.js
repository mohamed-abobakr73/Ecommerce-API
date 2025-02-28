import { Router } from "express";
import {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandsController.js";
import categoriesBrandsValidation from "../middlewares/categoriesBrandsValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAllowed from "../middlewares/isAllowed.js";
import usersRoles from "../utils/usersRoles.js";

const brandsRouter = Router();

brandsRouter.route("/").get(getAllBrands);
brandsRouter.route("/:brandId").get(getBrand);
brandsRouter
  .route("/")
  .post(
    verifyToken,
    isAllowed(usersRoles.ADMIN),
    categoriesBrandsValidation("brand"),
    createBrand
  );
brandsRouter
  .route("/:brandId")
  .patch(verifyToken, isAllowed(usersRoles.ADMIN), updateBrand);
brandsRouter
  .route("/:brandId")
  .delete(verifyToken, isAllowed(usersRoles.ADMIN), deleteBrand);

export default brandsRouter;

// TODO add roles utility and add the middleware to other routes
