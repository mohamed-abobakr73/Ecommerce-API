import mysql from "mysql2";
import { configDotenv } from "dotenv";

configDotenv();

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;

const optionsObject = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
};

const databaseConnection = mysql
  .createConnection({
    ...optionsObject,
    multipleStatements: true,
  })
  .promise();

const db = mysql
  .createPool({
    ...optionsObject,
    database: DATABASE_NAME,
  })
  .promise();

export { databaseConnection };
export default db;
