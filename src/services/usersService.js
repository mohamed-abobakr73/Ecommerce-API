import db from "../configs/connectToDb.js";
import { usersServiceQueries } from "../utils/sqlQueries/index.js";

const findAllUsers = async (filters = null) => {
  const [users] = await db.query(usersServiceQueries.findAllUsersQuery);
  return users;
};

const findUser = async (filters, includePassword = false) => {
  let selectedFields = usersServiceQueries.findUserSelectedFields;

  if (includePassword) {
    selectedFields += ", password";
  }

  let query = usersServiceQueries.findUserQuery(selectedFields);

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
  const query = usersServiceQueries.createUserQuery;

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
