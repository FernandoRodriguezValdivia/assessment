const {Schema, model} = require('mongoose')
const {hash} =require('bcrypt')

const schema = {
    'email': {
        type: String, 
        required: true
    },
    'password':{
        type: String, 
        required: true
    },
    'favs': [{
        type: Schema.Types.ObjectId,
        ref: "Fav"
    }]
}

const userSchema = Schema(schema)

userSchema.pre('save', async function save(next) {
    if (this.isNew || this.isModified('password')) {
      this.password = await hash(this.password, 10);
    }
    next();
});

userSchema.set('toJSON', {
    transform: (document, returnedObject)=>{
        delete returnedObject.password
        delete returnedObject.__v
    }
})

const User = model('User',userSchema)

module.exports = User