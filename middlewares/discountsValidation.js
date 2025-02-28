import { body } from "express-validator";

const discountsValidation = () => {
  return [
    body("sellerId")
      .notEmpty()
      .withMessage("Seller id is required")
      .isNumeric()
      .withMessage("Seller id must be a number"),
    body("code")
      .notEmpty()
      .withMessage("Discount code is required")
      .isLength({ min: 4 })
      .withMessage("Discount code must be at least 4 characters"),
    body("discountPercentage")
      .notEmpty()
      .withMessage("Discount percentage is required")
      .custom((value) => {
        if (value < 0) {
          throw new Error(
            "Discount percentage must be at least greater than or equal to 1"
          );
        } else if (value > 100) {
          throw new Error("Discount percentage must be at most 100");
        }
        return true;
      }),
    body("validFrom")
      .notEmpty()
      .withMessage("Valid from date is required")
      .isISO8601()
      .withMessage("Invalid date format (expected ISO 8601 format)"),
    body("validTo")
      .notEmpty()
      .withMessage("Valid from date is required")
      .isISO8601()
      .withMessage("Invalid date format (expected ISO 8601 format)"),
  ];
};

export default discountsValidation;
