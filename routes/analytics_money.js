// Подключаем сервер express
const express = require('express')
const passport = require('passport')
// Пременная отвечает за создание и работу с роутами
const router = express.Router()
// Подключаем контроллеры, в которых прописаны функции для роутов
const controller = require('../controllers/analytics_money')

router.get('/years', passport.authenticate('jwt', {session: false}), controller.getAllYear)
router.get('/months', passport.authenticate('jwt', {session: false}), controller.getAllMonth)
router.get('/coursecurrency', passport.authenticate('jwt', {session: false}), controller.getAllCurr)
router.get('/typecash', passport.authenticate('jwt', {session: false}), controller.getTypeCash)

module.exports = router
