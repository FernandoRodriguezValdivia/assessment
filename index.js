const express = require('express');
const app = require('./app')
const config = require('./config');
const { port } = config.server;
const connectToDb = require('./mongo')
connectToDb()


app.listen(port, () => {
    console.log(`App listening on ${port}`);
})