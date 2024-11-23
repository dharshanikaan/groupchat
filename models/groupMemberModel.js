const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const User = require("./userModel");
const Group = require("./groupModel");

const GroupMember = sequelize.define(
  "GroupMember",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);


GroupMember.belongsTo(Group, { foreignKey: "groupId", onDelete: "CASCADE" });
Group.hasMany(GroupMember, { foreignKey: "groupId" ,onDelete: "CASCADE"}); 

GroupMember.belongsTo(User, { foreignKey: "userId" , onDelete: "CASCADE"});
User.hasMany(GroupMember, { foreignKey: "userId" , onDelete: "CASCADE"}); 

module.exports = GroupMember;