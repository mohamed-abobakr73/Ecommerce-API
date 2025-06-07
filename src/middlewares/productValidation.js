import { body } from "express-validator";
const productValidation = (isPatch) => {
  const requiredCheck = (field) =>
    isPatch ? body(field).optional() : body(field);
  return [
    requiredCheck("productName")
      .notEmpty()
      .withMessage("Product name is required")
      .isLength({ min: 4 })
      .withMessage("Product name must be at least 4 characters")
      .isLength({ max: 20 })
      .withMessage("Product name can't be longer than 20 characters"),
    requiredCheck("productDescription")
      .notEmpty()
      .withMessage("Product description is required")
      .isLength({ min: 4 })
      .withMessage("Product description must be at least 20 characters")
      .isLength({ max: 500 })
      .withMessage("Product description can't be longer than 500 characters"),
    requiredCheck("price")
      .notEmpty()
      .withMessage("Product price is required")
      .isFloat({ decimal_digits: "0.2" })
      .withMessage("Price must be a valid integer or decimal number"),
    requiredCheck("stockQuantity")
      .notEmpty()
      .withMessage("Stock quantity is required")
      .isInt()
      .withMessage("Stock quantity must be a valid integer"),
    requiredCheck("category")
      .notEmpty()
      .withMessage("Product category is required"),
    requiredCheck("brand").notEmpty().withMessage("Product brand is required"),
    requiredCheck("sellerId")
      .notEmpty()
      .withMessage("Product seller id is required"),
  ];
};

export default productValidation;
