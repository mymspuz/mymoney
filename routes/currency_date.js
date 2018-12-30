// Подключаем сервер express
const express = require('express')
// Пременная отвечает за создание и работу с роутами
const router = express.Router()
// Подключаем контроллеры, в которых прописаны функции для роутов
const controller = require('../controllers/currency_date')

router.post('/:id', controller.getById)
router.post('/', controller.create)

module.exports = router