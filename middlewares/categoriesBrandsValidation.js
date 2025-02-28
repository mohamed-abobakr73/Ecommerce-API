import { body } from "express-validator";

const categoriesBrandsValidation = (field) => {
  return [
    body(`${field}Name`)
      .notEmpty()
      .withMessage(
        `${field.slice(0, 1).toUpperCase() + field.slice(1)} name is required`
      ),
  ];
};

export default categoriesBrandsValidation;
