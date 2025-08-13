import mysql from "mysql2";
import { configDotenv } from "dotenv";
import fs from "fs";

configDotenv();

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_SSL_CA = process.env.DATABASE_SSL_CA;

const optionsObject = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  port: DATABASE_PORT,
  ssl: {
    ca: DATABASE_SSL_CA,
  },
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
