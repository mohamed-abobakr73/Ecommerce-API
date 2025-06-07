import snakeToCamel from "../snakeToCamel.js";
import usersServiceQueries from "./usersServiceQueries.js";

const productWhereClauseQuery = `
  WHERE product_id = ?
`;

const findProductsQuery = `
  SELECT 
    product_id AS ${snakeToCamel("product_id")},
    product_name AS ${snakeToCamel("product_name")},
    product_description AS ${snakeToCamel("product_description")},
    price,
    stock_quantity AS ${snakeToCamel("stock_quantity")},
    category_name AS ${snakeToCamel("category_name")},
    brand_name AS ${snakeToCamel("brand_name")},
    image_path AS ${snakeToCamel("image_path")},
    products.created_at AS ${snakeToCamel("created_at")},

    ${usersServiceQueries.findUserFields}
  FROM
    products
        JOIN
    categories ON products.category_id = categories.category_id
        JOIN
    brands ON products.brand_id = brands.brand_id
        JOIN
    images ON products.product_image = images.image_id
        JOIN
    users ON products.seller_id = users.user_id
        JOIN
    roles ON users.role_id = roles.role_id
  `;

const findProductQuery = `
  ${findProductsQuery}
  ${productWhereClauseQuery}
`;

const createProductQuery = `
  INSERT INTO products
    (product_name, product_description, price, stock_quantity, seller_id, category_id, brand_id, product_image)
  VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?)
  `;

const deleteProductQuery = `
  DELETE FROM products
  ${productWhereClauseQuery}
`;

export default {
  findProductsQuery,
  findProductQuery,
  createProductQuery,
  deleteProductQuery,
};
