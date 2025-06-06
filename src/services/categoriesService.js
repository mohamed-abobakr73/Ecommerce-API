import db from "../configs/connectToDb.js";

const findAllCategories = async () => {
  const [categories] = await db.query(`SELECT * FROM categories`);
  return categories;
};

const findCategory = async (id) => {
  const query = `SELECT category_id as categoryId, category_name as categoryName FROM categories WHERE category_id = ?`;

  const category = await db.execute(query, [id]);
  return category[0][0];
};

const addNewCategory = async (categoryName) => {
  const query = `INSERT INTO categories (category_name) VALUES (?)`;

  const [result] = await db.execute(query, [categoryName]);

  const categoryId = result.insertId;

  return categoryId;
};

const updateCategory = async (id, updatedCategory) => {
  const query = `UPDATE categories SET category_name = ? WHERE category_id = ?`;
  const [result] = await db.execute(query, [updatedCategory, id]);
  return result.affectedRows;
};

const deleteCategory = async (id) => {
  const query = `DELETE FROM categories WHERE category_id = ?`;

  const [result] = await db.execute(query, [id]);
  return result.affectedRows;
};

export default {
  findAllCategories,
  findCategory,
  addNewCategory,
  updateCategory,
  deleteCategory,
};
