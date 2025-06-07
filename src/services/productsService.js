import db from "../configs/connectToDb.js";
import { productsServiceQueries } from "../utils/sqlQueries/index.js";
import camelToSnake from "../utils/camelToSnake.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";

// TODO ADD the update product, the find products by ids, and the decrement products quantity

const findAllProductsService = async () => {
  const query =
    productsServiceQueries.findProductsQuery + " ORDER BY product_id ASC;";

  const [products] = await db.query(query);

  return products;
};

const findProductsByIds = async (ids) => {
  const [result] = await db.query(
    getProductsQuery +
      ` WHERE product_id IN (${ids
        .map(() => "?")
        .join(", ")}) ORDER BY product_id ASC`,
    ids
  );
  return result;
};

const findProduct = async (productId) => {
  const query = productsServiceQueries.findProductQuery;

  const queryParams = [productId];

  const [[product]] = await db.execute(query, queryParams);

  checkIfResourceExists(product, "Product not found");

  return product;
};

const addNewProduct = async (product) => {
  const { productData, productImage } = product;

  const query = productsServiceQueries.createProductQuery;

  const queryParams = [
    productData.productName,
    productData.productDescription,
    productData.price,
    productData.stockQuantity,
    productData.sellerId,
    productData.category,
    productData.brand,
    productImage,
  ];

  const [result] = await db.execute(query, queryParams);

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
  const [result] = await db.execute(query, [...fieldsValues, id]);
  return result.affectedRows;
};

const deleteProduct = async (id) => {
  const query = productsServiceQueries.deleteProductQuery;

  const [result] = await db.execute(query, [id]);

  return result.affectedRows;
};

const decrementProductStockQuantity = async (products) => {
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

  const [result] = await db.execute(query, values);
  return result.affectedRows;
};

export default {
  findAllProductsService,
  findProductsByIds,
  findProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  decrementProductStockQuantity,
};
