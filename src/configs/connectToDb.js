import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // To read from env files.

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
// const DATABASE_NAME = process.env.DATABASE_NAME;

const db = mysql
  .createPool({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    // database: DATABASE_NAME,
  })
  .promise();

export default db;
