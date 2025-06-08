import db from "../configs/connectToDb.js";
import checkIfResourceExists from "../utils/checkIfResourceExists.js";
import { hashValue, compareHashedValues } from "../utils/hashingUtils/index.js";
import { generateJwt } from "../utils/jwtUtils/index.js";
import { usersServiceQueries } from "../utils/sqlQueries/index.js";
import cartService from "./cartService.js";

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
  const queryValues = Object.values(filters);
  return { whereClause: ` WHERE ${conditions}`, queryValues };
};

const findUserService = async (filters) => {
  try {
    let query = usersServiceQueries.findUserQuery;

    let queryParams = [];

    const filterKeys = Object.keys(filters);

    if (filterKeys.length > 0) {
      const { whereClause, queryValues } = createWhereConditions(filters);
      query += whereClause;
      queryParams = queryValues;
    }

    const user = await db.execute(query, queryParams);

    checkIfResourceExists(user, "User not found");

    return user[0][0];
  } catch (error) {
    throw error;
  }
};

const registerUserService = async (userData) => {
  let databaseConnection;
  try {
    databaseConnection = await db.getConnection();
    await databaseConnection.beginTransaction();

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

    const [user] = await databaseConnection.execute(query, queryParams);

    const userId = user.insertId;

    await cartService.createUserCartService(userId, databaseConnection);

    const token = await generateTokenWithUserData(userData);

    await databaseConnection.commit();

    return token;
  } catch (error) {
    if (databaseConnection) await databaseConnection.rollback();
    throw error;
  } finally {
    if (databaseConnection) await databaseConnection.rollback();
  }
};

const loginService = async (email, password) => {
  const user = await findUserService({ email });

  checkIfResourceExists(user, "Invalid credentials, please try again.");

  await compareHashedValues(
    password,
    user.password,
    "Invalid credentials, please try again."
  );

  const token = await generateTokenWithUserData(user);

  delete user.password;
  return { user, token };
};

export default {
  findAllUsers,
  findUserService,
  registerUserService,
  loginService,
};
