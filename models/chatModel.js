const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const user = require("./userModel");
const group = require("./groupModel");

const Chat = sequelize.define(
  "chat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: user,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: group,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

Chat.belongsTo(group, {
  foreignKey: "groupId",
  onDelete: "CASCADE",
});
Chat.belongsTo(user, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

module.exports = Chat;