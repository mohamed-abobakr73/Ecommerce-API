import pool from "./connectToDb.js";

const findCartId = async (userId) => {
  const [[{ cart_id: cartId }]] = await pool.query(
    `SELECT cart_id from cart WHERE user_id  = ?`,
    [userId]
  );
  return cartId;
};

const findCartItems = async (userId) => {
  const cartId = await findCartId(userId);

  if (!cartId) {
    return;
  }

  const [cartItems] = await pool.query(
    `
  SELECT 
    cart_items.*, products.*
  FROM
    cart_items
  JOIN
    products
  ON
    cart_items.product_id = products.product_id 
  WHERE
    cart_items.cart_id = ?;
`,
    [cartId]
  );

  return { cartId, cartItems };
};

const createUserCart = async (userId) => {
  const [result] = await pool.query(
    `INSERT INTO 
    cart
      (user_id)
    values
      (?)
  `,
    [userId]
  );

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

    const [result] = await pool.execute(query, [newQuantity, productId]);

    return { result: result.affectedRows, quantity: newQuantity };
  } else {
    const query = `INSERT INTO cart_items
      (cart_id, product_id, quantity)
    VALUES
      (?, ?, ?)
    `;

    const [result] = await pool.execute(query, [cartId, productId, quantity]);

    return { result: result.affectedRows, quantity };
  }
};

const updateCartItemQuantity = async (data) => {
  const { cartItemId, quantity } = data;
  const query = `UPDATE cart_items SET quantity = ? WHERE cart_items_id = ?`;
  const [result] = await pool.execute(query, [quantity, cartItemId]);
  return result.affectedRows;
};

const deleteItemFromCart = async (id) => {
  const query = `DELETE FROM cart_items WHERE cart_items_id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};

export default {
  findCartId,
  findCartItems,
  createUserCart,
  addItemToCart,
  updateCartItemQuantity,
  deleteItemFromCart,
};
