import { body } from "express-validator";

const addressesValidation = () => {
  return [
    body("addressLine1")
      .notEmpty()
      .withMessage("Address line 1 is required")
      .isLength({ min: 10 })
      .withMessage("Address line 1 must be at least 10 characters"),
    body("addressLine2")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Address line 2 must be at least 5 characters"),
    body("country")
      .notEmpty()
      .withMessage("Country is required")
      .isLength({ min: 2 })
      .withMessage("Country must be at least 2 characters"),
    body("state")
      .notEmpty()
      .withMessage("State is required")
      .isLength({ min: 2 })
      .withMessage("State must be at least 2 characters"),
    body("city")
      .notEmpty()
      .withMessage("City is required")
      .isLength({ min: 2 })
      .withMessage("City must be at least 2 characters"),
    body("isDefault")
      .optional()
      .isBoolean()
      .withMessage("Is default must be true or false"),
  ];
};

export default addressesValidation;
