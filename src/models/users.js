const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        minLength:8,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:['male','female','others']
    },
    photoURL:{
        type:String,
    },
    about:{
      type:String,
      default:"This is User About"
    },
    skills:{
        type:[String]
    }
   

},{timestamps:true})

userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({id:user.id},'qaz123#wwxcvb',{expiresIn:'1d'})
    return token;

}

userSchema.methods.comparePass = async function (PassByUser) {
    const user = this;
    const hashedPass = user.password;
    const isPassValid = await bcrypt.compare(PassByUser,hashedPass)
    return isPassValid;
    

}


const userModel = mongoose.model('users',userSchema)

module.exports = userModel;