import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import { categoriesServiceQueries } from "../utils/sqlQueries/index.js";

const findAllCategoriesService = async () => {
  const query = categoriesServiceQueries.findCategoriesQuery;

  const [categories] = await db.query(query);

  return categories;
};

const findCategoryService = async (categoryId) => {
  const query = categoriesServiceQueries.findCategoryQuery;

  const queryParams = [categoryId];

  const [category] = await db.execute(query, queryParams);

  checkIfResourceExists(category.length, "Category not found");

  return category[0];
};

const createCategoryService = async (categoryName) => {
  const query = categoriesServiceQueries.createCategoryQuery;

  const queryParams = [categoryName];

  const [result] = await db.execute(query, queryParams);

  const categoryId = result.insertId;

  return categoryId;
};

const updateCategoryService = async (categoryId, updatedCategory) => {
  const query = categoriesServiceQueries.updateCategoryQuery;

  const queryParams = [updatedCategory, categoryId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "Category not found");

  return result.affectedRows;
};

const deleteCategoryService = async (categoryId) => {
  const query = categoriesServiceQueries.deleteCategoryQuery;

  const queryParams = [categoryId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "Category not found");

  return result.affectedRows;
};

export default {
  findAllCategoriesService,
  findCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
