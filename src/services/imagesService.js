import pool from "./connectToDb.js";

const findAllImage = async () => {
  const [result] = pool.query(`SELECT * FROM images`);
  return result;
};

const findImage = async (imageId) => {
  const [query] = await pool.query(`SELECT * FROM images WHERE image_id = ?`, [
    imageId,
  ]);
  return query;
};

const addImage = async (imagePath) => {
  const [result] = await pool.query(
    `INSERT INTO
    images 
      (image_path)
    values
      (?)
  `,
    [imagePath]
  );
  return result.insertId;
};

export default { findAllImage, findImage, addImage };
