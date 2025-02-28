import { validationResult } from "express-validator";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import categoriesService from "../services/categoriesService.js";

const getAllCategories = asyncWrapper(async (req, res, next) => {
  const categories = await categoriesService.findAllCategories();
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { categories } });
});

const getCategory = asyncWrapper(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoriesService.findCategory(categoryId);

  if (!category) {
    const error = appError.create(
      "Category not found",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { category } });
});

const createCategory = asyncWrapper(async (req, res, next) => {
  const { categoryName } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newCategoryId = await categoriesService.addNewCategory(categoryName);

  const categoryData = {
    id: newCategoryId,
    categoryName,
  };

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { categoryData } });
});

const updateCategory = asyncWrapper(async (req, res, next) => {
  const { categoryId } = req.params;
  const { categoryName } = req.body;

  const findCategoryAndUpdate = await categoriesService.updateCategory(
    categoryId,
    categoryName
  );

  if (!findCategoryAndUpdate) {
    const error = appError.create(
      "Invalid category id",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const updatedCategory = { id: +categoryId, categoryName };
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updatedCategory },
  });
});

const deleteCategory = asyncWrapper(async (req, res, next) => {
  const { categoryId } = req.params;
  const findCategoryAndDelete = await categoriesService.deleteCategory(
    categoryId
  );

  if (!findCategoryAndDelete) {
    const error = appError.create(
      "Invalid category id",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

export {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
