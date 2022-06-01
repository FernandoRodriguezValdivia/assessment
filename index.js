const express = require('express');
const config = require('./config');
const { port } = config.server;
const database = require('./database');
const userRouter = require('./user/routes')
const favRouter = require('./fav/routers')

database.connect(config.database, {
  useNewUrlParser: true
});

const app = express();
app.use(express.json())
app.use('/auth',userRouter)
app.use('/api/favs',favRouter)

app.listen(port, () => {
    console.log(`App listening on ${port}`);
})