const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./user");
const Group = require("./group");

const GroupMember = sequelize.define("groupMember", {
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

GroupMember.belongsTo(Group, { foreignKey: "groupId" });
GroupMember.belongsTo(User, { foreignKey: "userId" });

module.exports = GroupMember;
