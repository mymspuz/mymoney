const Sequelize = require('sequelize')
const pg = require('pg')
const keys = require('../config/keys')

// PostgreSQL returns BIGINT (int8, oid 20) as a string by default to avoid
// precision loss. All ids here fit safely in a JS number, and the original
// MySQL app returned them as numbers, so parse int8 back to a number to keep
// the API responses identical.
pg.types.setTypeParser(20, (val) => (val === null ? null : parseInt(val, 10)))

const sequelize = new Sequelize(keys.dbName, keys.dbUser, keys.dbPassword, {
    host: keys.dbHost,
    port: keys.dbPort,
    dialect: 'postgres',
    logging: false,
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
