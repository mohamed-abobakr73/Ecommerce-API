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

const updateCategory = async (id, updatedCategory) => {
  const query = categoriesServiceQueries.updateCategoryQuery;

  const queryParams = [updatedCategory, id];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

const deleteCategory = async (id) => {
  const query = categoriesServiceQueries.deleteCategoryQuery;

  const queryParams = [id];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

export default {
  findAllCategoriesService,
  findCategoryService,
  createCategoryService,
  updateCategory,
  deleteCategory,
};
