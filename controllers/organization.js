const Organization = require('../models/Organization')
const errorHandler = require('../utils/errorHandler')
const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

module.exports.getAll = async function (req, res) {
    try {
        const organizations = await Organization.findAll({
            where: {
                user: req.user.id
            },
            order: [['name', 'ASC']]
        })
        res.status(200).json(organizations)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const organization = await Organization.findById(req.params.id)
        res.status(200).json(organization)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        await Organization.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            message: 'Organization be deleted'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    const organization = new Organization({
        name: req.body.name,
        user: req.user.id,
        image: req.file ? req.file.path : ''
    })

    try {
        await organization.save()
        res.status(201).json(organization)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {

        const organization = await Organization.update(
            {
                name: req.body.name,
                user: req.user.id,
                image: req.file ? req.file.path : ''
            },
            {where: {id: req.params.id}}
        )
        res.status(200).json(organization)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllSum = async function (req, res) {
    try {
        sequelize.query('SELECT o.id, o.name, sum(i.value) AS summa FROM incomes AS i LEFT JOIN organizations AS o ON i.organization_id = o.id GROUP BY o.id, o.name ORDER BY summa DESC',
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
        .catch(err => {
            console.error(err);
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getLastNumberMonth = async function (req, res) {
    try {
        sequelize.query('SELECT o.id, o.name, MONTHNAME(i.date) AS month, SUM(i.value) AS rub, SUM(i.value / (SELECT u.value FROM currency_date AS u WHERE u.date = i.date AND u.currency_sec = 1)) AS usd, SUM(i.value / (SELECT e.value FROM currency_date AS e WHERE e.date = i.date AND e.currency_sec = 2)) AS eur FROM incomes AS i LEFT JOIN organizations AS o ON i.organization_id = o.id WHERE i.date >= DATE_SUB(CURDATE(), Interval 6 MONTH) GROUP BY o.id, o.name, date_format(i.date, "%Y-%m") ORDER BY i.date DESC',
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

module.exports.getCurr = async function (req, res) {
    try {
        const url = 'http://apilayer.net/api/live?access_key=5aeebd574d7933d512d6f97b2e394b22&currencies=EUR,RUB&source=USD&format=1'
        //res.status(200).json(response)
        return this.http.jsonp<any>(url, '')
        // .pipe(
        //     map((response: Response) => response.json())
        // )
    } catch (e) {
        errorHandler(res, e)
    }
}