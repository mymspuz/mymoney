const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')
const Currency = require('../models/Currency')

const CurrencyDate = sequelize.define('currency_date', {
    date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    currency_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Currency,
            key: 'id',
        }
    },
    value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    // Real table is "currency_date" (all access is via raw SQL today, but keep
    // the model mapped correctly so ORM calls would not hit "currency_dates").
    tableName: 'currency_date'
})

module.exports = CurrencyDate
