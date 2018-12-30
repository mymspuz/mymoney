const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')
const Organization = require('../models/Organization')
const Currency = require('../models/Currency')
const User = require('../models/User')

const Income = sequelize.define('income', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    organization_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Organization,
            key: 'id',
        }
    },
    currency_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Currency,
            key: 'id',
        }
    },
    date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    cach: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    comments: {
        type: Sequelize.STRING,
        defaultValue: ''
    },
    user: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id',
        }
    }
})

module.exports = Income