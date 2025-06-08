import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import { brandsServiceQueries } from "../utils/sqlQueries/index.js";

const findAllBrandsService = async () => {
  const query = brandsServiceQueries.findBrandsQuery;

  const [brands] = await db.query(query);

  return brands;
};

const findBrandService = async (brandId) => {
  const query = brandsServiceQueries.findBrandQuery;

  const brand = await db.execute(query, [brandId]);

  checkIfResourceExists(brand, "brand not found");

  return brand[0][0];
};

const createBrandService = async (brandName) => {
  const query = brandsServiceQueries.createBrandQuery;

  const [result] = await db.execute(query, [brandName]);

  const brandId = result.insertId;

  return brandId;
};

const updateBrandService = async (brandId, newBrandName) => {
  const query = brandsServiceQueries.updateBrandQuery;

  const queryParams = [newBrandName, brandId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "brand not found");

  return result.affectedRows;
};

const deleteBrandService = async (brandId) => {
  const query = brandsServiceQueries.deleteBrandQuery;

  const queryParams = [brandId];

  const [result] = await db.execute(query, queryParams);

  checkIfResourceExists(result.affectedRows, "brand not found");

  return result.affectedRows;
};

export default {
  findAllBrandsService,
  findBrandService,
  createBrandService,
  updateBrandService,
  deleteBrandService,
};
