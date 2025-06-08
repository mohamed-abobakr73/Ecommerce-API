import db from "../configs/connectToDb.js";
import { brandsServiceQueries } from "../utils/sqlQueries/index.js";

const findAllBrandsService = async () => {
  const query = brandsServiceQueries.findBrandsQuery;

  const [brands] = await db.query(query);

  return brands;
};

const findBrand = async (id) => {
  const query = brandsServiceQueries.findBrandQuery;

  const brand = await db.execute(query, [id]);

  return brand[0][0];
};

const addNewBrand = async (brandName) => {
  const query = brandsServiceQueries.createBrandQuery;

  const [result] = await db.execute(query, [brandName]);

  const brandId = result.insertId;

  return brandId;
};

const updateBrand = async (id, brandToUpdate) => {
  const query = brandsServiceQueries.updateBrandQuery;

  const [result] = await db.execute(query, [brandToUpdate, id]);

  return result.affectedRows;
};

const deleteBrand = async (id) => {
  const query = brandsServiceQueries.deleteBrandQuery;

  const [result] = await db.execute(query, [id]);
  return result.affectedRows;
};

export default {
  findAllBrandsService,
  findBrand,
  addNewBrand,
  updateBrand,
  deleteBrand,
};
