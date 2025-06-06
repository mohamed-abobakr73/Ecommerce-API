import db from "../configs/connectToDb.js";
import AppError from "../utils/AppError.js";
import { usersServiceQueries } from "../utils/sqlQueries/index.js";

const findAllUsers = async (filters = null) => {
  const [users] = await db.query(usersServiceQueries.findAllUsersQuery);
  return users;
};

const createWhereConditions = (filters) => {
  const conditions = Object.keys(filters)
    .map((key) => `${key} = ?`)
    .join(" AND ");
  const queryParams = Object.values(filters);
  return { whereClause: ` WHERE ${conditions}`, queryParams };
};

const findUserService = async (filters, includePassword = false) => {
  try {
    let selectedFields = usersServiceQueries.findUserSelectedFields;

    if (includePassword) {
      selectedFields += ", password";
    }

    let query = usersServiceQueries.findUserQuery(selectedFields);

    let queryParams = [];

    const filterKeys = Object.keys(filters);

    if (filterKeys.length > 0) {
      const { whereClause, queryParams } = createWhereConditions(filters);
      query += whereClause;
      queryParams = queryParams;
    }

    const user = await db.execute(query, queryParams);

    if (!user) {
      const error = new AppError("User not found", 400, httpStatusText.FAIL);
      throw error;
    }

    return user[0][0];
  } catch (error) {
    throw error;
  }
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

export default { findAllUsers, findUserService, addNewUser };
