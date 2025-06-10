import { body } from "express-validator";

const reviewsValidation = () => {
  return [
    body("rating")
      .notEmpty()
      .withMessage("Rating is required")
      .isNumeric()
      .withMessage("Rating must be a number")
      .custom((value) => {
        if (value < 1) {
          throw new Error("Rating must be at least 1");
        }
        if (value > 5) {
          throw new Error("Rating must be at most 5");
        }
        return true;
      }),
    body("reviewText")
      .notEmpty()
      .withMessage("Reveiw text is required")
      .isLength({ min: 4 })
      .withMessage("Review text must be at least 4 characters")
      .isLength({ max: 1000 })
      .withMessage("Review text must be at most 1000 characters"),
  ];
};

export default reviewsValidation;
