require('dotenv').config({ path: '../expenseapppassword/.env' });
const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name
  process.env.DB_USERNAME,  // Database user
  process.env.DB_PASSWORD,  // Database password
  {
    host: process.env.DB_HOST,  // Database host (localhost)
    dialect: 'mysql',          // Dialect (MySQL)
    port: process.env.DB_PORT, // Port (default 3306)
    logging: false,            // Disable logging (optional)
  }
);

// Import models with sequelize instance and DataTypes passed to them
const models = {
  User: require('../models/user')(sequelize, DataTypes),
  Message: require('../models/message')(sequelize, DataTypes),
};

// Define relationships between models
models.Message.associate(models);

module.exports = { sequelize, models };
