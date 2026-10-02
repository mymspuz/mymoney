// Подключаем сервер express
const express = require('express')
const passport = require('passport')
// Пременная отвечает за создание и работу с роутами
const router = express.Router()
// Подключаем контроллеры, в которых прописаны функции для роутов
const controller = require('../controllers/currency')

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/', passport.authenticate('jwt', {session: false}), controller.update)

module.exports = router
