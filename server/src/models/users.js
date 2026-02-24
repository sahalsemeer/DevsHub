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
        default:'https://imgs.search.brave.com/j4MLNz4UHMqnN5ORNhb3JWWKMGcU3CtKf8qIKkHM3jE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC83/MC8wMS9kZWZhdWx0/LW1hbGUtYXZhdGFy/LXByb2ZpbGUtaWNv/bi1ncmV5LXBob3Rv/LXZlY3Rvci0zMTgy/NzAwMS5qcGc'
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
    const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1d'})
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