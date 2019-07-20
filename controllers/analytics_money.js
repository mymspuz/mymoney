const errorHandler = require('../utils/errorHandler')
const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

module.exports.getAllYear = function (req, res) {
    try {
        sequelize.query('SELECT YEAR(i.date) AS year,\n' +
            '\t   SUM(i.`value`) AS rub,\n' +
            '\t   SUM(i.`value` / (SELECT u.`value` FROM `currency_date` AS u WHERE u.`date` = i.`date` AND u.`currency_sec` = 1)) AS usd,\n' +
            '       SUM(i.`value` / (SELECT e.`value` FROM `currency_date` AS e WHERE e.`date` = i.`date` AND e.`currency_sec` = 2)) AS eur\n' +
            'FROM `incomes` AS i\n' +
            'GROUP BY date_format(i.`date`, "%Y")',
            {
                raw: true,
                type: Sequelize.QueryTypes.SELECT
            }
        )
            .then(
                projects => {
                    res.status(200).json(projects)
                }
            )
            .catch (err => {
                console.error(err);
            })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllMonth = function (req, res) {
    try {
        sequelize.query('SELECT CONCAT(LEFT(MONTHNAME(i.`date`), 3), ", ", year(i.`date`)) AS month_year,\n' +
                        '\t SUM(i.`value`) AS rub,\n' +
                        '\t SUM(i.`value` / (SELECT u.`value` FROM `currency_date` AS u WHERE u.`date` = i.`date` AND u.`currency_sec` = 1)) AS usd,\n' +
                        '\t SUM(i.`value` / (SELECT e.`value` FROM `currency_date` AS e WHERE e.`date` = i.`date` AND e.`currency_sec` = 2)) AS eur\n' +
                        'FROM `incomes` AS i\n' +
                        'GROUP BY date_format(i.`date`, "%Y-%m")\n' +
                        'ORDER BY i.`date` ASC',
            {
                raw: true,
                type: Sequelize.QueryTypes.SELECT
            }
        )
            .then(
                projects => {
                    res.status(200).json(projects)
                }
            )
            .catch (err => {
                console.error(err);
            })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllCurr = function (req, res) {
    try {
        sequelize.query('SELECT DISTINCT\n' +
                            '\t c.`date`,\n' +
                            '\t (SELECT u.`value` FROM `currency_date` AS u WHERE u.`date` = c.`date` AND u.`currency_sec` = 1) AS usd,\n' +
                            '\t (SELECT e.`value` FROM `currency_date` AS e WHERE e.`date` = c.`date` AND e.`currency_sec` = 2) AS eur\n' +
                            'FROM `currency_date` AS c\n' +
                            'ORDER BY c.`date`',
            {
                raw: true,
                type: Sequelize.QueryTypes.SELECT
            }
        )
            .then(
                projects => {
                    res.status(200).json(projects)
                }
            )
            .catch (err => {
                console.error(err);
            })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.overview = function (req, res) {

}

module.exports.analytics = function (req, res) {

}
