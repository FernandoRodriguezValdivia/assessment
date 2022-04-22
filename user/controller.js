const bcrypt = require('bcrypt')
const User = require('./model')
const jwt = require('jsonwebtoken')
const {secret} = require('../config').token

const verifiedPass = async (passwordSent, passwordStored) => {
    const isValid = await bcrypt.compare(passwordSent, passwordStored)
    return isValid
}

exports.create = async (req, res) => {
    const { email, password } = req.body
    const newUser = new User({ email, password})
    try{
        const savedUser = await newUser.save()
        res.status(200).send({
            'status': 'user created',
            'data': savedUser
        })
    } catch(e){
        console.log(e)
        res.status(500).send({'error': e.message})  
    }
}

exports.signin = async (req,res)=>{
    const { email, password } = req.body
    try{
        const user = await User.findOne({email})
        const isVerified = await verifiedPass(password, user.password)
        if(isVerified){
            const token = jwt.sign({ email }, secret)
            res.status(200).json({token})
        } else{
            res.status(403).json({"message": "Correo o contraseña incorrecta"})
        }
    } catch(e){
        res.status(403).json({"message": "Correo o contraseña incorrecta"})
    }
}

exports.get = async (req,res)=>{
    try{
        const users = await User.find({})
        res.status(200).json(users)
    }catch(e){
        res.status(403).json({"error": e.message})
    }
}