const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./user");

const Group = sequelize.define('chatGroup', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
}, {
  timestamps: true,
});

Group.belongsTo(User, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
User.hasMany(Group, { foreignKey: 'createdBy', onDelete: 'CASCADE' });

module.exports = Group;
