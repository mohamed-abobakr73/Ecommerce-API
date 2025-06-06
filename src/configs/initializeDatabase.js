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
} from "../models/index.js";
import { seedRoles } from "../utils/sqlQueries/index.js";
import db from "./connectToDb.js";

const initializeDatabase = async () => {
  // Create the database if it doesn't exist
  try {
    await db.query(`CREATE DATABASE IF NOT EXISTS ecommerce_db`);
    await db.query(`USE ecommerce_db`);

    await createRolesTable();
    await createUsersTable();

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

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Database initialization error:", error);
  }
};

export default initializeDatabase;
