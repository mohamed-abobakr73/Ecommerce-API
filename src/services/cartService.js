import db from "../configs/connectToDb.js";
import { cartServiceQueries } from "../utils/sqlQueries/index.js";

// TODO CHECK the add item to cart query and logic

const findCartId = async (userId) => {
  const query = cartServiceQueries.findCartIdQuery;

  const [[{ cart_id: cartId }]] = await db.execute(query, [userId]);

  return cartId;
};

const findCartItems = async (userId) => {
  const cartId = await findCartId(userId);

  if (!cartId) {
    return;
  }

  const query = cartServiceQueries.findCartItemsQuery;

  const [cartItems] = await db.execute(query, [cartId]);

  return { cartId, cartItems };
};

const createUserCartService = async (userId, databaseConnection) => {
  const query = cartServiceQueries.createUserCartQuery;

  const queryParams = [userId];

  const [result] = await databaseConnection.execute(query, queryParams);

  return result.affectedRows;
};

const addItemToCart = async (data) => {
  const { userId, productId, quantity } = data;
  const { cartId, cartItems } = await findCartItems(userId);

  const productIndex = cartItems.findIndex(
    (item) => item.product_id === productId
  );

  if (productIndex !== -1) {
    const query = `UPDATE cart_items
    SET quantity = ?
    WHERE product_id = ?
    `;

    let newQuantity;

    if (quantity > 1) {
      newQuantity = quantity;
    } else {
      const currentProductQuantity = cartItems[productIndex].quantity;
      newQuantity = currentProductQuantity + quantity;
    }

    const [result] = await db.execute(query, [newQuantity, productId]);

    return { result: result.affectedRows, quantity: newQuantity };
  } else {
    const query = `INSERT INTO cart_items
      (cart_id, product_id, quantity)
    VALUES
      (?, ?, ?)
    `;

    const [result] = await db.execute(query, [cartId, productId, quantity]);

    return { result: result.affectedRows, quantity };
  }
};

const updateCartItemQuantity = async (data) => {
  const { cartItemId, quantity } = data;

  const query = cartServiceQueries.updateCartItemQuantityQuery;

  const queryParams = [quantity, cartItemId];

  const [result] = await db.execute(query, queryParams);

  return result.affectedRows;
};

const deleteItemFromCart = async (id) => {
  const query = cartServiceQueries.deleteCartItemQuery;

  const [result] = await db.execute(query, [id]);

  return result.affectedRows;
};

export default {
  findCartId,
  findCartItems,
  createUserCartService,
  addItemToCart,
  updateCartItemQuantity,
  deleteItemFromCart,
};
