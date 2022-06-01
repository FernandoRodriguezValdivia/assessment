const {Schema, model} = require('mongoose')

const schema = {
    'name': {
        type: String, 
        required: true
    },
    'favs': [{
        "name": String,
        "description": String,
        "link": String
    }]
}

const favSchema = Schema(schema)

const Fav = model('Fav',favSchema)

module.exports = Fav