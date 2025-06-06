import db from "../configs/connectToDb.js";
import { categoriesServiceQueries } from "../utils/sqlQueries/index.js";

const findAllCategories = async () => {
  const query = categoriesServiceQueries.findAllCategoriesQuery;

  const [categories] = await db.query(query);

  return categories;
};

const findCategory = async (id) => {
  const query = categoriesServiceQueries.findCategoryQuery;

  const category = await db.execute(query, [id]);

  return category[0][0];
};

const addNewCategory = async (categoryName) => {
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
  findAllCategories,
  findCategory,
  addNewCategory,
  updateCategory,
  deleteCategory,
};
