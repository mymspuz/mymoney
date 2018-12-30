// Подключаем сервер express
const express = require('express')
// Пременная отвечает за создание и работу с роутами
const router = express.Router()
// Подключаем контроллеры, в которых прописаны функции для роутов
const controller = require('../controllers/analytics_money')

router.get('/overview', controller.overview)
router.get('/analytics', controller.analytics)

module.exports = router