const errorHandler = require('../utils/errorHandler')
const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

module.exports.getAllYear = function (req, res) {
    try {
        let sql = 'SELECT EXTRACT(YEAR FROM i.date)::int AS year,\n' +
                  '       SUM(i.value) AS rub,\n' +
                  '       SUM(i.value / (SELECT u.value FROM currency_date AS u WHERE u.date = i.date AND u.currency_sec = 1)) AS usd,\n' +
                  '       SUM(i.value / (SELECT e.value FROM currency_date AS e WHERE e.date = i.date AND e.currency_sec = 2)) AS eur\n' +
                  'FROM incomes AS i\n'

        if (req.query.oid && req.query.oid != '-1') {
          sql = sql + ' WHERE i.organization_id = :organization_id '
        }
        sql = sql + 'GROUP BY EXTRACT(YEAR FROM i.date)\n' +
                    'ORDER BY year'
        sequelize.query(sql,
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
        let sql = "SELECT to_char(i.date, 'Mon, YYYY') AS month_year,\n" +
                  '       SUM(i.value) AS rub,\n' +
                  '       SUM(i.value / (SELECT u.value FROM currency_date AS u WHERE u.date = i.date AND u.currency_sec = 1)) AS usd,\n' +
                  '       SUM(i.value / (SELECT e.value FROM currency_date AS e WHERE e.date = i.date AND e.currency_sec = 2)) AS eur\n' +
                  'FROM incomes AS i\n'
        if (req.query.oid && req.query.oid != '-1') {
          sql = sql + ' WHERE i.organization_id = :organization_id '
        }
        sql = sql + "GROUP BY to_char(i.date, 'Mon, YYYY'), to_char(i.date, 'YYYY-MM')\n" +
                    "ORDER BY to_char(i.date, 'YYYY-MM') ASC"
        sequelize.query(sql,
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
                            '\t c.date,\n' +
                            '\t (SELECT u.value FROM currency_date AS u WHERE u.date = c.date AND u.currency_sec = 1) AS usd,\n' +
                            '\t (SELECT e.value FROM currency_date AS e WHERE e.date = c.date AND e.currency_sec = 2) AS eur\n' +
                            'FROM currency_date AS c\n' +
                            'ORDER BY c.date',
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
                    '\t EXTRACT(YEAR FROM i.date)::int AS year,\n' +
                    '\t SUM(CASE WHEN i.cach = 0 THEN i.value ELSE 0 END) AS cash,\n' +
                    '\t SUM(CASE WHEN i.cach = 1 THEN i.value ELSE 0 END) AS card\n' +
                    'FROM incomes AS i\n' +
                    'GROUP BY EXTRACT(YEAR FROM i.date)\n' +
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
