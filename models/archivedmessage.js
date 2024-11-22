const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./user");
const Group = require("./group");

const ArchivedChat = sequelize.define("archivedChat", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
  },
}, {
  timestamps: true,
});

ArchivedChat.belongsTo(User, { foreignKey: "userId" });
ArchivedChat.belongsTo(Group, { foreignKey: "groupId" });

module.exports = ArchivedChat;
