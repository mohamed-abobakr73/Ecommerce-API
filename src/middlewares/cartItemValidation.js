import { body } from "express-validator";

const cartItemValidation = (quantityRequired = false) => {
  return [
    body("productId")
      .exists()
      .withMessage("productId is required")
      .isInt({ gt: 0 })
      .withMessage("productId must be a positive integer"),

    quantityRequired
      ? body("quantity")
          .exists()
          .withMessage("quantity is required")
          .isInt({ gt: 0 })
          .withMessage("quantity must be a positive integer")
      : body("quantity")
          .optional()
          .isInt({ gt: 0 })
          .withMessage("quantity must be a positive integer if provided"),
  ];
};

export default cartItemValidation;
