const { Sequelize, DataTypes } = require('sequelize');  // Import Sequelize and DataTypes

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,  // Now, Sequelize is imported and this should work fine
    },
  });

  // Associate Message model with User (optional if needed)
  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Message;
};
