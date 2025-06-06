import snakeToCamel from "../snakeToCamel.js";

const findBrandsQuery = `
  SELECT 
    brand_id as ${snakeToCamel("brand_id")},
    brand_name as ${snakeToCamel("brand_name")}
  FROM
    brands
`;

const findBrandQuery = findBrandsQuery + ` WHERE brand_id = ?`;

const createBrandQuery = `INSERT INTO brands (brand_name) VALUES (?)`;

const updateBrandQuery = `
  UPDATE brands
  SET brand_name = ?
  WHERE brand_id = ?
`;

const deleteBrandQuery = `DELETE FROM brands WHERE brand_id = ?`;

export default {
  findBrandsQuery,
  findBrandQuery,
  createBrandQuery,
  updateBrandQuery,
  deleteBrandQuery,
};
