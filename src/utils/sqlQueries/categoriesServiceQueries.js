import snakeToCamel from "../snakeToCamel.js";

const findCategoriesQuery = `
  SELECT 
    category_id AS ${snakeToCamel("category_id")}, 
    category_name AS ${snakeToCamel("category_name")} 
  FROM 
    categories
`;

const findCategoryQuery = findCategoriesQuery + ` WHERE category_id = ?`;

const createCategoryQuery = `
  INSERT INTO categories 
    (category_name) 
  VALUES 
    (?)`;

const updateCategoryQuery = `
  UPDATE 
    categories 
  SET 
    category_name = ? 
  WHERE 
    category_id = ?`;

const deleteCategoryQuery = `
      DELETE FROM 
        categories 
      WHERE 
        category_id = ?`;

export default {
  findCategoriesQuery,
  findCategoryQuery,
  createCategoryQuery,
  updateCategoryQuery,
  deleteCategoryQuery,
};
