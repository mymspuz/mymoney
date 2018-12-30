// Подключаем сервер express
const express = require('express')
// Пременная отвечает за создание и работу с роутами
const router = express.Router()
// Подключаем контроллеры, в которых прописаны функции для роутов
const controller = require('../controllers/currency')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.delete('/:id', controller.delete)
router.post('/', controller.create)
router.patch('/', controller.update)

module.exports = router