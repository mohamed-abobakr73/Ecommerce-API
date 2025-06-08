import snakeToCamel from "../snakeToCamel.js";

const checkIfUserExistsByIdQuery = `
    SELECT
      user_id
    FROM
      users
    WHERE
      user_id = ?
  `;

const findUserFields = `
    user_id AS ${snakeToCamel("user_id")},
    first_name AS ${snakeToCamel("first_name")},
    last_name AS ${snakeToCamel("last_name")},
    email,
    phone,
    role_name AS ${snakeToCamel("role")}
`;

const selectFromUsersJoinRolesQuery = `
  FROM 
    users 
  JOIN
    roles ON users.role_id = roles.role_id
`;

const findAllUsersQuery = `
  SELECT 
    ${findUserFields}
    ${selectFromUsersJoinRolesQuery}
`;

const findUserQuery = `
    SELECT 
      ${findUserFields + ", password"}
      ${selectFromUsersJoinRolesQuery}
      `;

const createUserQuery = `
  INSERT INTO users
    (first_name, last_name, email, password, phone, role_id)
  VALUES
      (?, ?, ?, ?, ?, ?)
  `;

export default {
  checkIfUserExistsByIdQuery,
  findAllUsersQuery,
  findUserFields,
  createUserQuery,
  findUserQuery,
};
