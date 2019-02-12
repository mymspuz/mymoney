const CurrencyDate = require('../models/CurrencyDate')
const errorHandler = require('../utils/errorHandler')
const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

module.exports.getByDate = async function (req, res) {
    try {
        sequelize.query('SELECT `currency_sec`, `value` FROM `currency_date` WHERE `date` = :date',
            {
                        replacements: { date: req.params.date },
                        raw: true,
                        type: Sequelize.QueryTypes.SELECT
                    }
        )
            .then(
                projects => {
                    res.status(200).json(projects)
                }
            )
            .catch(err => {
                console.error(err);
            })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        sequelize.query('INSERT INTO `currency_date` (`date`, `currency_base`, `currency_sec`, `value`) VALUES (:dateu, "0", "1", :vusd), (:datee, "0", "2", :veur)',
            {
                replacements: { dateu: req.body.date, datee: req.body.date, vusd: req.body.usd, veur: req.body.eur },
                //raw: true,
                type: Sequelize.QueryTypes.INSERT
            }
        )
            .then(
                projects => {
                    res.status(200).json(projects)
                }
            )
            .catch(err => {
                console.error(err);
            })
    } catch (e) {
        errorHandler(res, e)
    }
}
