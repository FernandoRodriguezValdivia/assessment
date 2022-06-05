const mongoose = require('mongoose')
const config = require('./config')
const NODE_ENV = config.nodEnv
const MONGO_URI = config.database[NODE_ENV].url

const connectToDb = async () =>{
	try {
		const connection = await mongoose.connect(MONGO_URI)
		console.log(`MongoDb Connected: ${connection.connection.host} in ${NODE_ENV}`)
		return connection
	} catch (error) {
		console.log(`MongoDB connection error: ${error}`)
	}	
}

module.exports = connectToDb