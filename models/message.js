module.exports = (sequelize, DataTypes) => {
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
        model: 'Users',  // Ensure this is 'Users' (matches the actual table name)
        key: 'id',
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
  }, {
    tableName: 'Messages',  // Explicitly specify 'Messages' as the table name
    timestamps: true,
  });

  // Associations
  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Message;
};
