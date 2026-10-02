const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')
const User = require('../models/User')

const Currency = sequelize.define('currency', {
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
    }
}, {
    // Real table is singular "currency"; without this Sequelize would
    // pluralize the model name and query a non-existent "currencies" table.
    tableName: 'currency'
})

module.exports = Currency
