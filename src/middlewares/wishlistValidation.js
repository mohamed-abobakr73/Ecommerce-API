import { body } from "express-validator";

const wishlistValidation = () => {
  return [body("productId").notEmpty().withMessage("Product ID is required")];
};

export default wishlistValidation;
