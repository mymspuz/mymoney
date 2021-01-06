const errorHandler = require('../utils/errorHandler')
const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

module.exports.getAllYear = function (req, res) {
    try {
        let mySQL = 'SELECT YEAR(i.date) AS year,\n' +
                    '\t   SUM(i.`value`) AS rub,\n' +
                    '\t   SUM(i.`value` / (SELECT u.`value` FROM `currency_date` AS u WHERE u.`date` = i.`date` AND u.`currency_sec` = 1)) AS usd,\n' +
                    '       SUM(i.`value` / (SELECT e.`value` FROM `currency_date` AS e WHERE e.`date` = i.`date` AND e.`currency_sec` = 2)) AS eur\n' +
                    'FROM `incomes` AS i\n'

        if (req.query.oid && req.query.oid != '-1') {
          mySQL = mySQL + ' WHERE i.organization_id = :organization_id '
        }
        mySQL = mySQL + 'GROUP BY date_format(i.`date`, "%Y")'
        sequelize.query(mySQL,
                {
                    replacements: {
                      organization_id: +req.query.oid,
                    },
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
        let mySQL = 'SELECT CONCAT(LEFT(MONTHNAME(i.`date`), 3), ", ", year(i.`date`)) AS month_year,\n' +
                    '\t SUM(i.`value`) AS rub,\n' +
                    '\t SUM(i.`value` / (SELECT u.`value` FROM `currency_date` AS u WHERE u.`date` = i.`date` AND u.`currency_sec` = 1)) AS usd,\n' +
                    '\t SUM(i.`value` / (SELECT e.`value` FROM `currency_date` AS e WHERE e.`date` = i.`date` AND e.`currency_sec` = 2)) AS eur\n' +
                    'FROM `incomes` AS i\n'
        if (req.query.oid && req.query.oid != '-1') {
          mySQL = mySQL + ' WHERE i.organization_id = :organization_id '
        }
        mySQL = mySQL + 'GROUP BY date_format(i.`date`, "%Y-%m")\n' +
                        'ORDER BY i.`date` ASC'
        sequelize.query(mySQL,
                {
                    replacements: {
                      organization_id: +req.query.oid,
                    },
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

module.exports.getTypeCash = function (req, res) {
  try {
    sequelize.query('SELECT\n' +
                    '\t YEAR(i.`date`) AS year,\n' +
                    '\t SUM(IF(i.`cach` = 0, i.`value`, 0)) AS cash,\n' +
                    '\t SUM(IF(i.`cach` = 1, i.`value`, 0)) AS card\n' +
                    'FROM `incomes` AS i\n' +
                    'GROUP BY date_format(i.`date`, "%Y")\n' +
                    'ORDER BY year',
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
