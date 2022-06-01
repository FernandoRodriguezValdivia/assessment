const favRouter = require('express').Router()
const controller = require('./controller')
const isAuthenticated = require('../middlewares/auth')

favRouter.post('/', isAuthenticated, controller.create)
favRouter.get('/',isAuthenticated, controller.getAll)
favRouter.get('/:id',isAuthenticated, controller.getOne)
favRouter.delete('/:id', isAuthenticated, controller.delete)

module.exports = favRouter