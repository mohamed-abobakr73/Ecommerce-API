import db from "../configs/connectToDb.js";
import { productsServiceQueries } from "../utils/sqlQueries/index.js";
import camelToSnake from "../utils/camelToSnake.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";

const findAllProductsService = async () => {
  const query =
    productsServiceQueries.findProductsQuery + " ORDER BY product_id ASC;";

  const [products] = await db.query(query);

  return products;
};

const findProductsByIds = async (productIds) => {
  const productIdsQuery = ids.map(() => "?").join(", ");

  const query = productsServiceQueries.findProductsByIdsQuery(productIdsQuery);

  const [result] = await db.execute(query, productIds);

  return result;
};

const findProductService = async (productId) => {
  const query = productsServiceQueries.findProductQuery;

  const queryParams = [productId];

  const [[product]] = await db.execute(query, queryParams);

  checkIfResourceExists(product, "Product not found");

  return product;
};

const createProductService = async (productData) => {
  const query = productsServiceQueries.createProductQuery;

  const queryParams = [
    productData.productName,
    productData.productDescription,
    productData.price,
    productData.stockQuantity,
    productData.sellerId,
    productData.category,
    productData.brand,
    productData.productImage,
  ];

  const [result] = await db.execute(query, queryParams);

  const product = await findProductService(result.insertId);

  return product;
};

const updateProductService = async (productId, data) => {
  const fieldsToUpdate = Object.keys(data)
    .map((field) => `${camelToSnake(field)} = ?, `)
    .join("")
    .slice(0, -2);

  const query = productsServiceQueries.updateProductQuery(fieldsToUpdate);

  const fieldsValues = Object.values(data);

  const queryParams = [...fieldsValues, productId];

  await db.execute(query, queryParams);

  const updatedProduct = await findProductService(productId);

  return updatedProduct;
};

const deleteProductService = async (id) => {
  const query = productsServiceQueries.deleteProductQuery;

  const [result] = await db.execute(query, [id]);

  checkIfResourceExists(result.affectedRows, "Product not found");

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
  findProductService,
  createProductService,
  updateProductService,
  deleteProductService,
  decrementProductStockQuantity,
};
