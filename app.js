const express = require('express');
const userRouter = require('./user/routes')
const favRouter = require('./fav/routers')

const app = express();

app.use(express.json())

app.use('/auth', userRouter)
app.use('/api/favs',favRouter)

module.exports = app