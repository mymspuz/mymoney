const Income = require('../models/Income')
const errorHandler = require('../utils/errorHandler')
const Sequelize = require('sequelize')
const sequelize = require('../shared/mysqlconnect')

module.exports.getAll = async function (req, res) {
    let sorganization = ' '
    let mySQL = 'SELECT i.*, o.name AS oname ' +
                'FROM incomes AS i ' +
                'LEFT JOIN organizations AS o ON i.organization_id = o.id ' +
                'WHERE i.user = :user '
    if (req.query.organization_id && req.query.organization_id !== '') {
        mySQL = mySQL + `AND o.id = ${req.query.organization_id} `
    }
    if (req.query.sdate && req.query.sdate !== '') {
        mySQL = mySQL + `AND i.date >= "${req.query.sdate}" `
    }
    if (req.query.edate && req.query.edate !== '') {
        mySQL = mySQL + `AND i.date <= "${req.query.edate}" `
    }
    try {
        sequelize.query( mySQL +
                            'ORDER BY i.date DESC ' +
                            'LIMIT :offset, :limit',
    {
                replacements: {
                                user: req.user.id,
                                offset: +req.query.offset,
                                limit: +req.query.limit
                            },
                //raw: true,
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

module.exports.getByOrganizationId = async function (req, res) {
    try{
        const incomes = await Income.findAll({
            where: {
                organization_id: req.params.id,
                user: req.user.id
            },
            order: [['date', 'DESC']]
        })
        res.status(200).json(incomes)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try{
        const income = await Income.findById(req.params.id)
        res.status(201).json(income)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try{
        await Income.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            message: 'Income be deleted'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try{
        const income = await new Income({
            organization_id: req.body.organization_id,
            currency_id: req.body.currency_id,
            date: req.body.date,
            value: req.body.value,
            cach: req.body.cach,
            comments: req.body.comments,
            user: req.user.id
        }).save()
        res.status(201).json(income)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try{
        const income = await Income.update(req.body, {where: {id: req.params.id}})
        res.status(200).json(income)
    } catch (e) {
        errorHandler(res, e)
    }
}