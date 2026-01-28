const { Schema, Mongoose, default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    text:{
        type:String,
        required:true,
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    }

})

const chatSchema = new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:'users',required:true}],
    messages:[messageSchema]
})

const chatModel = mongoose.model('chats',chatSchema)


module.exports = chatModel;