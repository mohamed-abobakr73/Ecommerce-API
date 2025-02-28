import pool from "./connectToDb.js";
import camelToSnake from "../utils/camelToSnake.js";
import snakeToCamel from "../utils/snakeToCamel.js";

const getProductsQuery = `
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

const findAllProducts = async () => {
  const [products] = await pool.query(
    getProductsQuery + " ORDER BY product_id ASC;"
  );
  return products;
};

const findProductsByIds = async (ids) => {
  const [result] = await pool.query(
    getProductsQuery +
      ` WHERE product_id IN (${ids
        .map(() => "?")
        .join(", ")}) ORDER BY product_id ASC`,
    ids
  );
  return result;
};

const findProduct = async (id) => {
  const query = getProductsQuery + " WHERE product_id = ?;";

  const [[productData]] = await pool.execute(query, [id]);
  return productData;
};

const addNewProduct = async (product) => {
  const { productData, productImage } = product;
  const {
    productName,
    productDescription,
    price,
    stockQuantity,
    sellerId,
    category,
    brand,
  } = productData;

  const query = `INSERT INTO
  products
    (product_name, product_description, price, stock_quantity, seller_id, category_id, brand_id, product_image)
  values
    (?, ?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.execute(query, [
    productName,
    productDescription,
    price,
    stockQuantity,
    sellerId,
    category,
    brand,
    productImage,
  ]);

  return result.insertId;
};

const updateProduct = async (id, data) => {
  const fieldsToUpdate = Object.keys(data)
    .map((field) => `${camelToSnake(field)} = ?, `)
    .join("");

  const fieldsValues = Object.values(data);

  const query = `UPDATE products SET ${fieldsToUpdate.slice(
    0,
    fieldsToUpdate.length - 2
  )}
    WHERE product_id = ?
  `;
  const [result] = await pool.execute(query, [...fieldsValues, id]);
  return result.affectedRows;
};

const deleteProduct = async (id) => {
  const query = `DELETE FROM products WHERE product_id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};

const decrementProductStockQunatity = async (products) => {
  const query = `
  UPDATE products
  SET stock_quantity = CASE
  ${products
    .map((_, i) => `WHEN product_id = ? THEN stock_quantity - ?`)
    .join(" ")}
  END
  WHERE product_id IN (${products.map(() => "?").join(", ")});`;

  const values = products
    .flatMap((product) => [product.id, product.quantity])
    .concat(products.map((product) => product.id));

  const [result] = await pool.execute(query, values);
  return result.affectedRows;
};

export default {
  findAllProducts,
  findProductsByIds,
  findProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  decrementProductStockQunatity,
};
