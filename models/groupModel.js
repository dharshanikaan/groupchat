const {DataTypes} = require("sequelize");
const sequelize = require("../util/db");
const user = require("./userModel");

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
            model: user,
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
}, {
    timestamps: true,
});

Group.belongsTo(user, { foreignKey: 'createdBy' , onDelete: 'CASCADE'});
user.hasMany(Group, { foreignKey: 'createdBy', onDelete: 'CASCADE'});

module.exports = Group;