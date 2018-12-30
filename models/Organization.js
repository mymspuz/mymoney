const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')
const User = require('../models/User')

const Organization = sequelize.define('organization', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id',
        }
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Organization