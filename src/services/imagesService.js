import db from "../configs/connectToDb.js";

const findAllImage = async () => {
  const [result] = db.query(`SELECT * FROM images`);
  return result;
};

const findImage = async (imageId) => {
  const [query] = await db.query(`SELECT * FROM images WHERE image_id = ?`, [
    imageId,
  ]);
  return query;
};

const addImage = async (imagePath) => {
  const [result] = await db.query(
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
