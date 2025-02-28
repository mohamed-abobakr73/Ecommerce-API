import { body } from "express-validator";

const orderValidation = () => {
  return [
    body("userId")
      .notEmpty()
      .withMessage("User id is required")
      .isNumeric()
      .withMessage("User id must be a number"),
    body("products")
      .isArray()
      .withMessage("Products must be an array")
      .custom((value) => {
        if (value.length === 0) {
          throw new Error("The products array must include products objects");
        }
        return true;
      }),
    body("discountId")
      .optional()
      .isNumeric()
      .withMessage("Discount id must be a number"),
  ];
};

export default orderValidation;
