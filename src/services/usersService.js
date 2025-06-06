import db from "../configs/connectToDb.js";
import AppError from "../utils/AppError.js";
import hashValue from "../utils/hashingUtils/hashValue.js";
import { generateJwt } from "../utils/jwtUtils/index.js";
import { usersServiceQueries } from "../utils/sqlQueries/index.js";

const generateTokenWithUserData = async (user) => {
  const { firstName, lastName, email, role } = user;

  const userId = user.insertId;

  const tokenPayload = {
    userName: `${firstName} ${lastName}`,
    email: email,
    id: userId,
    role: role,
  };

  const token = await generateJwt(tokenPayload);
  return token;
};

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

const registerUserService = async (userData) => {
  const query = usersServiceQueries.createUserQuery;

  const { firstName, lastName, password, email, phone, role } = userData;

  const hashedPassword = await hashValue(password);

  const queryParams = [
    firstName,
    lastName,
    email,
    hashedPassword,
    phone,
    role || 1,
  ];

  const [user] = await db.execute(query, queryParams);

  const token = await generateTokenWithUserData(userData);

  return token;
};

export default { findAllUsers, findUserService, registerUserService };
