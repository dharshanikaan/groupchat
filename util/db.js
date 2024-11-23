//util/db.js
const dotenv = require("dotenv");
dotenv.config({ path: '../expenseapppassword/.env' }); // This will load the environment variables from the custom `.env` file
const { Sequelize, DataTypes } = require("sequelize");
// Create a new Sequelize instance using the environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,         // Database name
  process.env.DB_USERNAME,     // Database user
  process.env.DB_PASSWORD,     // Database password
  {
    host: process.env.DB_HOST, // Database host (localhost)
    dialect: "mysql",          // Dialect (MySQL)
    port: process.env.DB_PORT, // Port (default 3306 or from .env)
    logging: false,            // Disable logging (optional)
  }
);

module.exports = sequelize;
