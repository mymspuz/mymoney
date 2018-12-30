const Currency = require('../models/Currency')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        const currency = await Currency.findAll({
            where: {
                user: req.user.id
            }
        })
        res.status(200).json(currency)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const currency = await Currency.findById(req.params.id)
        res.status(200).json(currency)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        await Currency.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            message: 'Currency be deleted'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const currency = await new Currency({
            name: req.body.name,
            user: req.user.id
        }).save()
        res.status(201).json(currency)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = function (req, res) {

}