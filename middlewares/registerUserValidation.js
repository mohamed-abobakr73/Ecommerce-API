import { body } from "express-validator";

const registerUserValidation = () => [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 4 })
    .withMessage("First name must be at least 4 characters")
    .isLength({ max: 20 })
    .withMessage("First name can't be longer than 20 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 4 })
    .withMessage("Last name must be at least 4 characters")
    .isLength({ max: 20 })
    .withMessage("Last name can't be longer than 20 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
];

export default registerUserValidation;
