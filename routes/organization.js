// Подключаем сервер express
const express = require('express')
const passport = require('passport')
const upload = require('../middleware/upload')
// Пременная отвечает за создание и работу с роутами
const router = express.Router()
// Подключаем контроллеры, в которых прописаны функции для роутов
const controller = require('../controllers/organization')

router.get('/month', passport.authenticate('jwt', {session: false}), controller.getLastNumberMonth)
router.get('/summ', passport.authenticate('jwt', {session: false}), controller.getAllSum)
router.get('/curr', passport.authenticate('jwt', {session: false}), controller.getCurr)
router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update)
module.exports = router