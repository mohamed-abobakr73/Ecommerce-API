import db from "../configs/connectToDb.js";
import snakeToCamel from "../utils/snakeToCamel.js";

const findAllUsers = async (filters = null) => {
  const [users] = await db.query(`SELECT 
  user_id as userId, first_name as firstName, last_name as lastName, email, phone, role_name as role
FROM
  users
      JOIN
  roles ON users.role_id = roles.role_id;
`);
  return users;
};

const findUser = async (filters, includePassword = false) => {
  let selectedFields = `
    user_id as ${snakeToCamel("user_id")},
    first_name as ${snakeToCamel("first_name")},
    last_name as ${snakeToCamel("last_name")},
    email,
    phone,
    role_name as role`;

  if (includePassword) {
    selectedFields += ", password";
  }

  let query = `SELECT ${selectedFields} FROM users JOIN
  roles ON users.role_id = roles.role_id`;

  let queryParams = [];

  // Add filters if provided
  if (Object.keys(filters).length > 0) {
    const conditions = Object.keys(filters)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    query += ` WHERE ${conditions}`;
    queryParams = Object.values(filters);
  }

  // Execute query
  const user = await db.execute(query, queryParams);
  return user[0][0];
};

const addNewUser = async (userData) => {
  const query = `INSERT INTO users
    (first_name, last_name, email, password, phone, role_id)
    values (?, ?, ?, ?, ?, ?)
  `;

  const queryParams = [
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.phone,
    userData.role,
  ];

  const [user] = await db.execute(query, queryParams);
  const userId = user.insertId;
  return userId;
};

export default { findAllUsers, findUser, addNewUser };
