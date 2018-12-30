const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

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
        allowNull: false,
        unique: true
    }
})

module.exports = CurrencyDate