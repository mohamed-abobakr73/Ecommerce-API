import {
  createUsersTable,
  createRolesTable,
  createProductsTable,
  createCategoriesTable,
  createBrandsTable,
  createDiscountsTable,
  createOrdersTable,
  createOrderItemsTable,
  createReviewsTable,
  createCartTable,
  createCartItemsTable,
  createWishListsTable,
  createPaymentsTable,
  createAddressesTable,
  createImagesTable,
} from "../models/index.js";
import { seedRoles } from "../utils/sqlQueries/index.js";
import { configDotenv } from "dotenv";
import { databaseConnection } from "./connectToDb.js";

configDotenv();

const DATABASE_NAME = process.env.DATABASE_NAME;

const initializeDatabase = async () => {
  try {
    await databaseConnection.query(
      `CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`
    );
    await databaseConnection.query(`USE ${DATABASE_NAME}`);

    await createRolesTable();
    await createUsersTable();
    await createImagesTable();

    await createCategoriesTable();
    await createBrandsTable();
    await createProductsTable();

    await createDiscountsTable();

    await createCartTable();
    await createWishListsTable();
    await createCartItemsTable();

    await createOrdersTable();
    await createOrderItemsTable();

    await createPaymentsTable();

    await createReviewsTable();

    await createAddressesTable();

    await seedRoles();

    await databaseConnection.changeUser({ database: DATABASE_NAME });

    await databaseConnection.end();
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Database initialization error:", error);
  }
};

export default initializeDatabase;
