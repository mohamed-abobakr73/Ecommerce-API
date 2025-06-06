import snakeToCamel from "../snakeToCamel.js";

const findProductsQuery = `
SELECT 
  product_id as ${snakeToCamel("product_id")},
  product_name as ${snakeToCamel("product_name")},
  product_description as ${snakeToCamel("product_description")},
  price,
  stock_quantity as ${snakeToCamel("stock_quantity")},
  category_name as ${snakeToCamel("category_name")},
  brand_name as ${snakeToCamel("brand_name")},
  image_path as ${snakeToCamel("image_path")},
  products.created_at as ${snakeToCamel("created_at")},
  seller_id as ${snakeToCamel("seller_id")}
FROM
  products
      JOIN
  categories ON products.category_id = categories.category_id
      JOIN
  brands ON products.brand_id = brands.brand_id
      JOIN
  images ON products.product_image = images.image_id`;

const createProductQuery = `
  INSERT INTO products
    (product_name, product_description, price, stock_quantity, seller_id, category_id, brand_id, product_image)
  VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?)
  `;

const deleteProductQuery = `
  DELETE FROM products
  WHERE product_id = ?
`;

export default { findProductsQuery, createProductQuery, deleteProductQuery };
