// Подключаем сервер express
const express = require('express')
// Пременная отвечает за создание и работу с роутами
const router = express.Router()
// Подключаем контроллеры, в которых прописаны функции для роутов
const controller = require('../controllers/auth')

router.post('/login', controller.login)
router.post('/register', controller.register)

module.exports = router