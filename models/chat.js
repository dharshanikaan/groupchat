const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./user");
const Group = require("./group");

const Chat = sequelize.define("chat", {
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
      model: User,
      key: "id",
    },
    allowNull: false,
    onDelete: "CASCADE",
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  timestamps: true,
});

Chat.belongsTo(Group, {
  foreignKey: "groupId",
  onDelete: "CASCADE",
});
Chat.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

module.exports = Chat;
