import snakeToCamel from "../snakeToCamel.js";

const findWishlistItemsQuery = (whereClause) => {
  return `
    SELECT 
      wishlist.user_id AS ${snakeToCamel("user_id")},
      products.product_id AS ${snakeToCamel("product_id")},
      products.product_name AS ${snakeToCamel("product_name")},
      products.product_description AS ${snakeToCamel("product_description")},
      products.price,
      categories.category_name AS ${snakeToCamel("category_name")},
      brands.brand_name AS ${snakeToCamel("brand_name")},
      images.image_path AS ${snakeToCamel("image_path")}
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
      ${whereClause}
    `;
};

const addItemToWishlistQuery = `
  INSERT INTO wishlist 
    (user_id, product_id)
  VALUES
    (?, ?);
`;

const deleteItemFromWishlistQuery = `
  DELETE FROM
    wishlist
  WHERE 
    user_id = ? 
  AND 
    product_id = ?;
`;

export default {
  findWishlistItemsQuery,
  addItemToWishlistQuery,
  deleteItemFromWishlistQuery,
};
