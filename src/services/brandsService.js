import db from "../configs/connectToDb.js";

const findAllBrands = async () => {
  const [brands] = await db.query(`SELECT * FROM brands`);
  return brands;
};

const findBrand = async (id) => {
  const query = `SELECT brand_id as brandId, brand_name as brandName FROM brands WHERE brand_id = ?`;

  const brand = await db.execute(query, [id]);
  return brand[0][0];
};

const addNewBrand = async (brandName) => {
  const query = `INSERT INTO brands (brand_name) VALUES (?)`;

  const [result] = await db.execute(query, [brandName]);

  const brandId = result.insertId;

  return brandId;
};

const updateBrand = async (id, updatedbrand) => {
  const query = `UPDATE brands SET brand_name = ? WHERE brand_id = ?`;
  const [result] = await db.execute(query, [updatedbrand, id]);
  return result.affectedRows;
};

const deleteBrand = async (id) => {
  const query = `DELETE FROM brands WHERE brand_id = ?`;

  const [result] = await db.execute(query, [id]);
  return result.affectedRows;
};

export default {
  findAllBrands,
  findBrand,
  addNewBrand,
  updateBrand,
  deleteBrand,
};
