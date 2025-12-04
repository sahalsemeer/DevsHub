const mongoose  = require('mongoose')


const connectionsSchema = new mongoose.Schema({
    FromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    ToUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true

    },
    status:{
        type:String,
        required:true,
        enum:['interested','ignored','accepted','rejected']
    }
},{timestamps:true})

connectionsSchema.pre('save',async function (){
    const connectionReq = this;
    if(connectionReq.FromUserId.equals(connectionReq.ToUserId)){
        throw new Error('You cannot Sent Request  to Yourself!')
    }
    
})


const ConnectionsRequests = mongoose.model('connectionRequests',connectionsSchema)


module.exports = ConnectionsRequests;