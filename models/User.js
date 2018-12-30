const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

const User = sequelize.define('users', {
    // id: {
    //     type: Sequelize.INTEGER,
    //     primaryKey: true
    // },
    fname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    logname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    gender: {
        type: Sequelize.TINYINT(1),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = User