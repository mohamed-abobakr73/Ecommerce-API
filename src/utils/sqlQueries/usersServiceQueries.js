import snakeToCamel from "../snakeToCamel.js";

const findAllUsersQuery = `
  SELECT 
    user_id as ${snakeToCamel("user_id")},
    first_name as ${snakeToCamel("first_name")},
    last_name as ${snakeToCamel("last_name")},
    email,
    phone,
    role_name as ${snakeToCamel("role")}
  FROM
    users
        JOIN
    roles ON users.role_id = roles.role_id;
`;

export default { findAllUsersQuery };
