const jwt = require('jsonwebtoken')
const {secret} = require('../config').token

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization.slice(7)
    try{
        const { email } = jwt.verify(token, secret)
        req.email = email
        next()
    }catch(e){
        res.status(403).json({"error": "Unauthenticated"})
    }
}

module.exports = isAuthenticated