const Sequelize = require('sequelize')
const keys = require('../config/keys')

const sequelize = new Sequelize(keys.dbName, keys.dbUser, keys.dbPassword, {
    host: keys.dbHost,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

module.exports = sequelize