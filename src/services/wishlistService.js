import pool from "../configs/connectToDb.js";

const getAllwishlistItems = async (userId) => {
  const query = `
  SELECT 
    wishlist.user_id AS userId,
    products.product_id AS productId,
    products.product_name AS productName,
    products.product_description AS productDescription,
    products.price,
    categories.category_name AS categoryName,
    brands.brand_name AS brandName,
    images.image_path AS imagePath
FROM
  wishlist
      JOIN
  products ON wishlist.product_id = products.product_id
      JOIN
  categories ON products.category_id = categories.category_id
      JOIN
  brands ON products.brand_id = brands.brand_id
      JOIN
  images ON products.product_image = images.image_id
WHERE
  user_id = ?;
  `;
  const [result] = await pool.query(query, [userId]);
  return result;
};

const findWishlistItem = async (data) => {
  const { userId, productId } = data;
  const query = `
    SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?
  `;

  const [[result]] = await pool.query(query, [userId, productId]);
  return result;
};

const addItemToWishlist = async (data) => {
  const { userId, productId } = data;
  const query = `
    INSERT INTO wishlist 
      (user_id, product_id)
    VALUES
      (?, ?)
  `;
  const [result] = await pool.query(query, [userId, productId]);
  return result.affectedRows;
};

const removeItemFromWishlist = async (data) => {
  const { userId, productId } = data;
  const query = `
  DELETE FROM wishlist WHERE user_id = ? AND product_id = ?
`;
  const [result] = await pool.query(query, [userId, productId]);
  return result.affectedRows;
};

export default {
  getAllwishlistItems,
  findWishlistItem,
  addItemToWishlist,
  removeItemFromWishlist,
};
