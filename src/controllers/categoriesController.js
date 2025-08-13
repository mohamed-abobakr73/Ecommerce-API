import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import httpStatusText from "../utils/httpStatusText.js";
import categoriesService from "../services/categoriesService.js";

const getAllCategories = asyncWrapper(async (req, res, next) => {
  const categories = await categoriesService.findAllCategoriesService();

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { categories } });
});

const getCategory = asyncWrapper(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await categoriesService.findCategoryService(categoryId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { category } });
});

const createCategory = asyncWrapper(async (req, res, next) => {
  const { categoryName } = req.body;

  const newCategoryId = await categoriesService.createCategoryService(
    categoryName
  );

  const categoryData = {
    id: newCategoryId,
    categoryName,
  };

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { category: categoryData } });
});

const updateCategory = asyncWrapper(async (req, res, next) => {
  const { categoryId } = req.params;

  const validatedData = req.body;

  const { categoryName } = validatedData;

  await categoriesService.updateCategoryService(categoryId, categoryName);

  const updatedCategory = { categoryId: +categoryId, categoryName };

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updatedCategory },
  });
});

const deleteCategory = asyncWrapper(async (req, res, next) => {
  const { categoryId } = req.params;

  await categoriesService.deleteCategoryService(categoryId);

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
