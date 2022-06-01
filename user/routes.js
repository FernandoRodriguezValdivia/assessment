const controller = require('./controller')
const userRouter = require('express').Router()

userRouter.post('/create', controller.create)
userRouter.post('/local/login',controller.signin)
userRouter.get('/get', controller.get)

module.exports = userRouter