require('dotenv').config();

const config = {
    database: {
        url: process.env.MONGO_DB_URI
    },
    token: {
        secret: process.env.TOKEN_SECRET
    }
}