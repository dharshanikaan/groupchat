const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const user = require("./userModel");
const group = require("./groupModel");

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
      model: user,
      key: "id",
    },
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: group,
      key: "id",
    },
  },
 
}, {
  timestamps: true
}
);

ArchivedChat.belongsTo(user, { foreignKey: "userId" });
ArchivedChat.belongsTo(group, { foreignKey: "groupId" });

module.exports = ArchivedChat;