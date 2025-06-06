import db from "./connectToDb";

const initializeDatabase = async () => {
  // Create the database if it doesn't exist
  await db.query(`CREATE DATABASE IF NOT EXISTS ecommerce_db`);
  await db.query(`USE ecommerce_db`);
};

export default initializeDatabase;
